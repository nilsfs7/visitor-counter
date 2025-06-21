import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('visit')
export class VisitEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => ProjectEntity, project => project.visit, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
