import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VisitEntity } from './visit.entity';

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

  @OneToMany(() => VisitEntity, visit => visit.project, {
    cascade: true,
  })
  visit: VisitEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
