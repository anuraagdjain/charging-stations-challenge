import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStations1656742217042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`CREATE TABLE IF NOT EXISTS stations(
            id INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            company_id INT(11) NOT NULL,
            active TINYINT(1),
            created_at DATETIME NOT NULL DEFAULT NOW(),
            PRIMARY KEY(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP TABLE stations;');
  }
}
