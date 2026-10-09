import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToMany, BeforeInsert } from 'typeorm';
import { createProjectId, PROJECT_ID_LENGTH } from '@/lib/id';
import { ViewEntity } from './view.entity';

@Entity('project')
export class ProjectEntity {
  @PrimaryColumn('varchar', { length: PROJECT_ID_LENGTH, name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  destination: string;

  @OneToMany(() => ViewEntity, view => view.project, {
    cascade: true,
  })
  view: ViewEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = createProjectId();
    }
  }
}
