import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { StationType } from './StationType.entity';

@Entity({ name: 'stations' })
export class Station {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ name: 'company_id' })
  companyId!: number;

  @Column()
  active!: Boolean;

  @Column({ name: 'created_at', default: 'NOW()' })
  createdAt!: Date;

  @OneToOne(() => StationType, (stationType) => stationType.stationId)
  stationType?: StationType;
}
