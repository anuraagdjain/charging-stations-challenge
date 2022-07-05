import axios from 'axios';
import { expect } from 'chai';
import config from 'config';
const parsedInstructions = require('../../fixtures/parsedInstructions.json');
const scripts = require('../../fixtures/scripts.json');

describe('Parser Router v1 Integration', function () {
  const { host, port } = config.get('server');
  const API_URL = `http://${host}:${port}/api/v1/parser`;

  describe('POST /parser', function () {
    scripts.tests.forEach((testData: string, idx: number) => {
      const scriptIdx = idx + 1;
      it(`Successful - converts script ${scriptIdx} to instructions`, async function () {
        const { data: response } = await axios.post(API_URL, testData, {
          headers: { 'Content-Type': 'text/plain' },
        });

        expect(response).to.be.an('object');
        expect(response).to.have.key('data');
        expect(response.data).to.be.an('array');
        const parsedInstruction = parsedInstructions[`test${scriptIdx}`];

        response.data.forEach((instruction: any, index: number) => {
          expect(instruction).to.have.all.keys([
            'step',
            'companies',
            'timestamp',
            'totalChargingStations',
            'totalChargingPower',
          ]);

          expect(instruction.step).to.be.eq(parsedInstruction[index].step);
          expect(instruction.totalChargingPower).to.be.eq(parsedInstruction[index].totalChargingPower);
          expect(instruction.companies).to.deep.eq(parsedInstruction[index].companies);
          expect(instruction.totalChargingStations).to.deep.eq(parsedInstruction[index].totalChargingStations);
        });
      });
    });
  });
});
