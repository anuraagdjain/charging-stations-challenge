import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Station } from './Station.entity';

@Entity({ name: 'station_types' })
export class StationType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'station_id', unique: true })
  @JoinColumn({ name: 'station_id' })
  @OneToOne(() => Station, (station) => station.id)
  stationId!: number;

  @Column({ name: 'max_power' })
  maxPower!: number;

  @Column({ name: 'created_at', default: 'NOW()' })
  createdAt!: Date;
}
