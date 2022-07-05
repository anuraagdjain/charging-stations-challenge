import axios from 'axios';
import { expect } from 'chai';
import config from 'config';
import { Station } from '../../../src/db/entities/Station.entity';
import { StationType } from '../../../src/db/entities/StationType.entity';

describe('StationTypes Router v1 Integration', function () {
  const { host, port } = config.get('server');
  const API_URL = `http://${host}:${port}/api/v1/station-types`;

  describe('GET /station-types', function () {
    it('Successful - gets all station-types from the database', async function () {
      const { data } = await axios.get(API_URL);

      expect(data).to.be.an('array');
      expect(data.length).to.be.eq(5);

      data.forEach((row: StationType) => {
        expect(row).to.have.keys(['id', 'name', 'stationId', 'maxPower', 'createdAt']);
        expect(row.id).to.be.an('number');
        expect(row.name).to.be.a('string');
        expect(row.createdAt).to.be.an('string');
        expect(row.stationId).to.be.a('number');
        expect(row.maxPower).to.be.a('number');
      });
    });
  });

  describe('POST /station-types', function () {
    let station: Station;
    beforeEach('seed station', async function () {
      station = (
        await this.db.getRepository(Station).save([
          {
            name: 'station 10',
            companyId: 1,
          },
        ])
      )[0];
    });

    it('Successful - create a station-type for a station', async function () {
      const payload: Partial<StationType> = {
        name: 'StationType 5',
        stationId: station.id,
        maxPower: 10,
      };

      const { data, status } = await axios.post(API_URL, payload);

      expect(status).to.be.eq(201);
      expect(data).to.have.keys(['id', 'name', 'stationId', 'createdAt', 'maxPower']);
      expect(data.name).to.be.eq(payload.name);
      expect(data.stationId).to.be.eq(payload.stationId);
      expect(data.maxPower).to.be.eq(payload.maxPower);
    });

    it('Error - fails to create a station-type with missing stationId', async function () {
      const payload = {
        name: 'station-type 007',
        stationId: 999,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('StationId 999 is missing in db');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain("Field 'max_power' doesn't have a default value");
      }
    });

    it('Error - fails to create a station-type without maxPower', async function () {
      const payload = {
        name: 'StationType 87',
        stationId: station.id,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('maxPower is missing');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain('ER_NO_DEFAULT_FOR_FIELD');
      }
    });

    it('Error - fails to create a station-type for existing stationId', async function () {
      const payload = {
        name: 'StationType 87',
        stationId: 2,
        maxPower: 20,
      };

      try {
        await axios.post(API_URL, payload);
        expect.fail('stationId 2 already has a station-type');
      } catch (err: any) {
        expect(err.response.status).to.be.eq(500);
        expect(err.response.data.error).to.contain("Duplicate entry '2' for key 'station_types.station_id'");
      }
    });
  });

  describe('DELETE /station-types/:id', function () {
    it('Successful - Delete a station in the database', async function () {
      const stationTypeId = 1;
      let [result] = await this.db.query('SELECT * FROM station_types where id = ?', [stationTypeId]);

      expect(result.id).to.be.eq(stationTypeId);

      const { status } = await axios.delete(`${API_URL}/${stationTypeId}`);
      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM station_types where id = ?', [stationTypeId]);
      expect(result.length).to.be.eq(0);
    });

    it('Successful - No operations for missing stationId', async function () {
      const stationTypeId = 999;

      let result = await this.db.query('SELECT * FROM station_types;');
      expect(result.length).to.be.eq(5);

      const { status } = await axios.delete(`${API_URL}/${stationTypeId}`);

      expect(status).to.be.eq(200);

      result = await this.db.query('SELECT * FROM station_types;');
      expect(result.length).to.be.eq(5);
    });
  });

  describe('PUT /station-types/:id', function () {
    it('Successful - Update a station-type in the database', async function () {
      const stationTypeId = 1;
      const oldName = 'StationType 1';
      const payload = { name: 'station-type 55' };

      const [beforeUpdate] = await this.db.query('SELECT * FROM station_types where id = ?', [stationTypeId]);
      expect(beforeUpdate.name).to.be.eq(oldName);

      const { status, data } = await axios.put(`${API_URL}/${stationTypeId}`, payload);

      expect(status).to.be.eq(200);
      expect(data.id).to.be.eq(beforeUpdate.id);
      expect(data.name).to.be.eq(payload.name);
      expect(data.maxPower).to.be.eq(beforeUpdate.max_power);

      const [afterUpdate] = await this.db.query('SELECT * FROM station_types where id = ?', [stationTypeId]);

      expect(afterUpdate.name).to.be.eq(payload.name);
      expect(afterUpdate.max_power).to.be.eq(beforeUpdate.max_power);
      expect(afterUpdate.station_id).to.be.eq(beforeUpdate.station_id);
    });
  });
});
