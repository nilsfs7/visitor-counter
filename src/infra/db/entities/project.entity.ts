import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ViewEntity } from './view.entity';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  destination: string;

  @OneToMany(() => ViewEntity, visit => visit.project, {
    cascade: true,
  })
  view: ViewEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
