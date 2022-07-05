import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { In } from 'typeorm';
import { Company } from '../db/entities/Company.entity';
import { Station } from '../db/entities/Station.entity';
import logger from '../utils/logger';
dayjs.extend(utc);

interface CompanyStationData {
  id: number;
  chargingStations: number[];
  chargingPower: number;
}
interface Instruction {
  step: string;
  timestamp: number;
  companies?: CompanyStationData[];
  totalChargingStations?: number[];
  totalChargingPower: number;
}

export default (services: any) => {
  function getStartAndStopInstructions(instructionsArray: Array<Array<string>>) {
    return instructionsArray.filter((instruction: Array<string>) => {
      const [instructionType] = instruction;
      if (['start', 'stop'].includes(instructionType.toLocaleLowerCase())) {
        return instruction;
      }
    });
  }

  async function fetchStationsAndUpdateCache(inputStationId: string, stationsCache: any, visitedStations: Set<number>) {
    let stations: Station[];
    const isAllStations = isNaN(Number(inputStationId)) && inputStationId.toLocaleLowerCase() === 'all';
    if (isAllStations) {
      stations = await services.stationService.findWithStationType();
    } else {
      const station = stationsCache[inputStationId];
      if (!station) {
        stations = await services.stationService.findWithStationType({
          where: { id: inputStationId },
        });
      } else {
        stations = [station];
      }
    }

    stations.forEach((station: Station) => {
      stationsCache[station.id] = station;
      visitedStations.add(station.id);
    });
  }

  async function fetchStationCompaniesAndUpdateCache(
    visitedStations: Set<number>,
    stationsCache: any,
    companiesCache: any,
    companyStationMap: any
  ) {
    const companyIds: number[] = [];
    visitedStations.forEach((stationId: any) => {
      const s = stationsCache[stationId];
      if (!Object.hasOwnProperty.call(companiesCache, s.companyId)) {
        companyIds.push(s.companyId);
      }

      if (!Object.hasOwnProperty.call(companyStationMap, s.companyId)) {
        companyStationMap[s.companyId] = new Set();
      }
      companyStationMap[s.companyId].add(s.id);
    });

    if (companyIds.length) {
      const remainingCompanies = await services.companyService.get({ where: { id: In(companyIds) } });
      // save the data in cache.
      remainingCompanies.forEach((company: Company) => {
        companiesCache[company.id] = company;
        const parentId = company.parentId;
        if (parentId) {
          if (!Object.hasOwnProperty.call(companyStationMap, parentId)) {
            companyStationMap[parentId] = new Set();
          }
          if (companyStationMap[company.id]) {
            companyStationMap[company.id].forEach((e: number) => {
              companyStationMap[parentId].add(e);
            });
          }
        }
      });
    }
  }

  function generateCompaniesPayload(companyStationMap: any, stationsCache: any) {
    const result: CompanyStationData[] = [];
    Object.keys(companyStationMap).forEach((companyId: string) => {
      const chargingStations: any = Array.from(companyStationMap[companyId]);
      if (chargingStations.length) {
        const chargingPower = chargingStations.reduce((total: number, stationId: number) => {
          return total + stationsCache[stationId].stationType.maxPower;
        }, 0);
        result.push({
          id: Number(companyId),
          chargingStations,
          chargingPower,
        });
      }
    });
    return result;
  }

  function computeTotalChargingPower(visitedStations: Set<number>, stationsCache: any): number {
    let totalChargingPower = 0;
    visitedStations.forEach((stationId: number) => {
      totalChargingPower += stationsCache[stationId].stationType.maxPower ?? 0;
    });
    return totalChargingPower;
  }

  function removeStationFromCache(stationId: string, caches: any, companyStationMap: any) {
    const station = caches.stationsCache[stationId];
    const company = caches.companiesCache[station.companyId];
    companyStationMap[company.id].delete(+stationId);
    if (company.parentId) {
      companyStationMap[company.parentId].delete(+stationId);
    }
  }

  function removeStation(
    inputStationId: string,
    visitedStations: Set<number>,
    stationsCache: any,
    companiesCache: any,
    companyStationMap: any
  ) {
    if (inputStationId === 'all') {
      visitedStations.clear();
      Object.keys(stationsCache).forEach((stationId: string) => {
        removeStationFromCache(stationId, { stationsCache, companiesCache }, companyStationMap);
      });
    } else {
      visitedStations.delete(+inputStationId);
      removeStationFromCache(inputStationId, { stationsCache, companiesCache }, companyStationMap);
    }
  }

  async function convertToInstructions(scriptInstructions: string[]): Promise<Instruction[]> {
    let payload: Instruction[] = [];
    const companiesCache: any = {};
    const stationsCache: any = {};
    const companyStationMap: any = {};
    const visitedStations: Set<number> = new Set();

    const instructionsArray = scriptInstructions.map((scriptInput: string) => scriptInput.split(' '));
    const instructionQueue = getStartAndStopInstructions(instructionsArray);

    for (const instruction of instructionQueue) {
      const [instructionType, , inputStationId] = instruction;
      if (instructionType.toLocaleLowerCase() === 'start') {
        await fetchStationsAndUpdateCache(inputStationId, stationsCache, visitedStations);

        const totalChargingPower = computeTotalChargingPower(visitedStations, stationsCache);

        await fetchStationCompaniesAndUpdateCache(visitedStations, stationsCache, companiesCache, companyStationMap);

        const companiesPayload = generateCompaniesPayload(companyStationMap, stationsCache);

        payload.push({
          step: instruction.join(' '),
          companies: companiesPayload,
          totalChargingStations: Array.from(visitedStations),
          timestamp: dayjs.utc().unix(),
          totalChargingPower,
        });
      } else if (instructionType.toLocaleLowerCase() === 'stop') {
        removeStation(inputStationId, visitedStations, stationsCache, companiesCache, companyStationMap);

        const totalChargingPower = computeTotalChargingPower(visitedStations, stationsCache);

        const companiesPayload = generateCompaniesPayload(companyStationMap, stationsCache);

        payload.push({
          step: instruction.join(' '),
          companies: companiesPayload,
          totalChargingStations: Array.from(visitedStations),
          timestamp: dayjs.utc().unix(),
          totalChargingPower,
        });
      }
    }

    return payload;
  }
  async function convertScriptInputToInstruction(script: string): Promise<Instruction[]> {
    const scriptInstructions = script.split('\n').map((s: String) => s.trim());
    const parsedInstructions: Instruction[] = await convertToInstructions(scriptInstructions);
    const payload: Instruction[] = [];
    let currentTime = dayjs.utc();

    scriptInstructions.forEach((scriptInput: string) => {
      logger.info(`Processing instruction - ${scriptInput}`);
      const [instructionType, arg2] = scriptInput.split(' ');
      switch (instructionType.toLowerCase()) {
        case 'begin': {
          const instruction: Instruction = {
            step: scriptInput,
            companies: [],
            totalChargingStations: [],
            totalChargingPower: 0,
            timestamp: currentTime.unix(),
          };
          payload.push(instruction);
          break;
        }
        case 'start':
        case 'stop': {
          const formattedInstruction = parsedInstructions.shift();
          if (formattedInstruction) {
            formattedInstruction!.timestamp = currentTime.unix();
            payload.push(formattedInstruction);
          }

          break;
        }
        case 'wait': {
          if (!isNaN(Number(arg2))) {
            currentTime = currentTime.add(Number(arg2), 'seconds');
          } else {
            logger.warn('Invalid value given for Wait command');
          }
          break;
        }
        case 'end': {
          const previousPayload = payload[payload.length - 1];
          const instruction: Instruction = {
            step: scriptInput,
            companies: previousPayload?.companies,
            totalChargingStations: previousPayload?.totalChargingStations,
            totalChargingPower: previousPayload?.totalChargingPower ?? 0,
            timestamp: currentTime.unix(),
          };
          payload.push(instruction);
          break;
        }
        default:
          throw new Error(`Invalid instruction type - ${instructionType} `);
      }
    });
    return payload;
  }

  return {
    convertScriptInputToInstruction,
  };
};
