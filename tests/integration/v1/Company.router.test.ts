import axios from 'axios';
import { expect } from 'chai';
import config from 'config';
import { Company } from '../../../src/db/entities/Company.entity';

describe('Companies Router v1 Integration', function () {
  const { host, port } = config.get('server');
  const API_URL = `http://${host}:${port}/api/v1/companies`;

  beforeEach('seed', async function () {
    await this.db.getRepository(Company).save([
      {
        name: 'Company 1',
        active: true,
        parentId: null,
      },
      {
        name: 'Company 2',
        active: true,
        parentId: 1,
      },
      {
        name: 'Company 3',
        active: true,
        parentId: 1,
      },
    ]);
  });

  afterEach('cleanup', function () {
    return this.db.getRepository(Company).clear();
  });

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

  describe.only('POST /companies', function () {
    it('Successful - create a company with null parentId & sets active as true', async function () {
      const payload = {
        name: 'Company 5',
        parentId: null,
      };

      const { data } = await axios.post(API_URL, payload);

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
});
