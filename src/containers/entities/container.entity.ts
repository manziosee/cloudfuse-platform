import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { App } from '../../apps/entities/app.entity';

@Entity()
export class Container {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  containerId!: string;

  @Column()
  type!: string; // 'docker' or 'kubernetes'

  @Column()
  status!: string; // 'running', 'stopped', 'error'

  @Column('json', { nullable: true })
  metadata!: any;

  @ManyToOne(() => App)
  app!: App;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}