import axios from 'axios';
import { expect } from 'chai';
import config from 'config';
import { Company } from '../../../src/db/entities/Company.entity';

describe('Companies Router v1 Integration', function () {
  const { host, port } = config.get('server');
  const API_URL = `http://${host}:${port}/api/v1/companies`;

  describe('GET /companies', function () {
    it('Successful - gets all companies from the database', async function () {
      const { data } = await axios.get(API_URL);

      expect(data).to.be.an('array');
      expect(data.length).to.be.eq(3);

      data.forEach((row: Company) => {
        expect(row).to.have.keys(['id', 'name', 'parentId', 'createdAt', 'active']);
        expect(row.id).to.be.an('number');
        expect(row.name).to.be.a('string');
        expect(row.createdAt).to.be.an('string');
        expect(row.active).to.be.an('boolean');
        expect(typeof row.parentId).to.be.oneOf(['number', 'object']);
      });
    });
  });

  describe('POST /companies', function () {
    it('Successful - create a company with null parentId & sets active as true', async function () {
      const payload = {
        name: 'Company 5',
        parentId: null,
      };

      const { data, status } = await axios.post(API_URL, payload);

      expect(status).to.be.eq(201);
      expect(data).to.have.keys(['id', 'name', 'parentId', 'createdAt', 'active']);
      expect(data.name).to.be.eq(payload.name);
      expect(data.parentId).to.be.eq(payload.parentId);
    });

    it('Error - fails to create a company with existing name', async function () {
      const payload = {
        name: 'Company 1',
        parentId: null,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('Company 1 already exists');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain('Duplicate entry');
      }
    });
  });

  describe('DELETE /companies/:id', function () {
    it('Successful - Delete a company in the database', async function () {
      const companyId = 3;
      let [result] = await this.db.query('SELECT * FROM companies where id = ?', [companyId]);

      expect(result.id).to.be.eq(companyId);

      const { status } = await axios.delete(`${API_URL}/${companyId}`);
      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM companies where id = ?', [companyId]);
      expect(result.length).to.be.eq(0);
    });

    it('Successful - No operations for missing companyId', async function () {
      const companyId = 999;

      let result = await this.db.query('SELECT * FROM companies;');
      expect(result.length).to.be.eq(3);

      const { status } = await axios.delete(`${API_URL}/${companyId}`);

      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM companies;');
      expect(result.length).to.be.eq(3);
    });

    it('Error - Returns error when deleting a company with child companies', async function () {
      const companyId = 1;

      try {
        await axios.delete(`${API_URL}/${companyId}`);
        expect.fail('Cannot delete company 1 as child exists');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.eq('Cannot delete company as child comapnies exist!');
      }
    });
  });

  describe('PUT /companies/:id', function () {
    it('Successful - Update a company in the database', async function () {
      const companyId = 3;
      const oldName = 'Company 3';
      const payload = { name: 'New Company 3', parentId: null };

      const [beforeUpdate] = await this.db.query('SELECT * FROM companies where id = ?', [companyId]);

      const { status } = await axios.put(`${API_URL}/${companyId}`, payload);
      expect(status).to.be.eq(200);

      expect(beforeUpdate.name).to.be.eq(oldName);
      expect(beforeUpdate.parent_id).to.be.eq(1);

      const [afterUpdate] = await this.db.query('SELECT * FROM companies where id = ?', [companyId]);

      expect(afterUpdate.name).to.be.eq(payload.name);
      expect(afterUpdate.parent_id).to.be.eq(payload.parentId);
    });
  });
});
