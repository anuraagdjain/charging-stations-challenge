import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStationType1656748205858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`CREATE TABLE IF NOT EXISTS station_types(
            id INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            max_power INT(5) NOT NULL,
            station_id INT(11) NOT NULL UNIQUE,
            created_at DATETIME NOT NULL DEFAULT NOW(),
            PRIMARY KEY(id),
            FOREIGN KEY (station_id) REFERENCES stations(id)
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP TABLE station_types;');
  }
}
