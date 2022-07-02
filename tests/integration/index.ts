import { MySqlDataSource } from '../../src/db';
import { Company } from '../../src/db/entities/Company.entity';
import { Station } from '../../src/db/entities/Station.entity';

before('Chore', async function () {
  this.db = await MySqlDataSource.initialize();
});

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

  await this.db.getRepository(Station).save([
    {
      name: 'station 1',
      companyId: 1,
      active: true,
    },
    {
      name: 'station 2',
      companyId: 1,
      active: true,
    },
  ]);
});

afterEach('cleanup', async function () {
  await this.db.query('SET FOREIGN_KEY_CHECKS = 0;');
  await this.db.getRepository(Station).clear();
  await this.db.getRepository(Company).clear();
  await this.db.query('SET FOREIGN_KEY_CHECKS = 1;');
});

after('Teardown', function () {
  if (this.db) this.db.destroy();
});
