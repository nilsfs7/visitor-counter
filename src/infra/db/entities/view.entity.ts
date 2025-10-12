import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('view')
export class ViewEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => ProjectEntity, project => project.view, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
