import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'station_types' })
export class StationType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'station_id', unique: true })
  stationId!: number;

  @Column({ name: 'max_power' })
  maxPower!: number;

  @Column({ name: 'created_at', default: 'NOW()' })
  createdAt!: Date;
}
