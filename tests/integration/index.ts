import { MySqlDataSource } from '../../src/db';

before('Chore', async function () {
  this.db = await MySqlDataSource.initialize();
});

after('Teardown', function () {
  if (this.db) this.db.destroy();
});
