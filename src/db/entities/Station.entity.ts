import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
