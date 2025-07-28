import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { App } from '@apps/entities/app.entity';
import { User } from '@users/entities/user.entity';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'building' | 'active' | 'failed';

  @Column({ nullable: true })
  url: string;

  @Column('jsonb', { nullable: true })
  metadata: {
    imageName?: string;
    deploymentName?: string;
    serviceName?: string;
    ingressName?: string;
    buildLogs?: string[];
    runtimeLogs?: string[];
    language?: string;
    version?: string;
    framework?: string;
  };

  @ManyToOne(() => App, (app) => app.deployments)
  app: App;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}