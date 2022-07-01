import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'parent_id' })
  parentId?: number;

  @Column()
  active!: Boolean;

  @Column({ name: 'created_at' })
  createdAt!: Date;
}
