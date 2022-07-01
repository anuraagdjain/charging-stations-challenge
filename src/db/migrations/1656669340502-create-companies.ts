import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCompanies1656669340502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`CREATE TABLE IF NOT EXISTS companies(
            id INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            parent_id INT(11) NULL,
            active TINYINT(1),
            created_at DATETIME NOT NULL DEFAULT NOW(),
            PRIMARY KEY(id)
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP TABLE companies;');
  }
}
