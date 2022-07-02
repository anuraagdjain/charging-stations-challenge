import axios from 'axios';
import { expect } from 'chai';
import config from 'config';
import { Station } from '../../../src/db/entities/Station.entity';

describe('Stations Router v1 Integration', function () {
  const { host, port } = config.get('server');
  const API_URL = `http://${host}:${port}/api/v1/stations`;

  describe('GET /stations', function () {
    it('Successful - gets all stations from the database', async function () {
      const { data } = await axios.get(API_URL);

      expect(data).to.be.an('array');
      expect(data.length).to.be.eq(2);

      data.forEach((row: Station) => {
        expect(row).to.have.keys(['id', 'name', 'companyId', 'createdAt', 'active']);
        expect(row.id).to.be.an('number');
        expect(row.name).to.be.a('string');
        expect(row.createdAt).to.be.an('string');
        expect(row.active).to.be.an('boolean');
        expect(row.companyId).to.be.a('number');
      });
    });
  });

  describe('POST /stations', function () {
    it('Successful - create a station & sets active as true', async function () {
      const payload = {
        name: 'Station 5',
        companyId: 2,
      };

      const { data, status } = await axios.post(API_URL, payload);

      expect(status).to.be.eq(201);
      expect(data).to.have.keys(['id', 'name', 'companyId', 'createdAt', 'active']);
      expect(data.name).to.be.eq(payload.name);
      expect(data.companyId).to.be.eq(payload.companyId);
    });

    it('Error - fails to create a company with existing name', async function () {
      const payload = {
        name: 'station 1',
        companyId: 1,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('Station 1 already exists');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain('Duplicate entry');
      }
    });

    it('Error - fails to create a company without companyId', async function () {
      const payload = {
        name: 'Station 87',
        compantId: null,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('CompanyId is missing');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain('ER_NO_DEFAULT_FOR_FIELD');
      }
    });
  });

  describe('DELETE /stations/:id', function () {
    it('Successful - Delete a station in the database', async function () {
      const stationId = 1;
      let [result] = await this.db.query('SELECT * FROM stations where id = ?', [stationId]);

      expect(result.id).to.be.eq(stationId);

      const { status } = await axios.delete(`${API_URL}/${stationId}`);
      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM stations where id = ?', [stationId]);
      expect(result.length).to.be.eq(0);
    });

    it('Successful - No operations for missing stationId', async function () {
      const stationId = 999;

      let result = await this.db.query('SELECT * FROM stations;');
      expect(result.length).to.be.eq(2);

      const { status } = await axios.delete(`${API_URL}/${stationId}`);

      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM stations;');
      expect(result.length).to.be.eq(2);
    });
  });

  describe('PUT /stations/:id', function () {
    it('Successful - Update a station in the database', async function () {
      const stationId = 2;
      const oldName = 'station 2';
      const payload = { name: 'station 55' };

      const [beforeUpdate] = await this.db.query('SELECT * FROM stations where id = ?', [stationId]);

      const { status } = await axios.put(`${API_URL}/${stationId}`, payload);
      expect(status).to.be.eq(200);

      expect(beforeUpdate.name).to.be.eq(oldName);

      const [afterUpdate] = await this.db.query('SELECT * FROM stations where id = ?', [stationId]);

      expect(afterUpdate.name).to.be.eq(payload.name);
    });
  });
});
