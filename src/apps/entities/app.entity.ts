import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Deployment } from '../../deployments/entities/deployment.entity';

@Entity()
export class App {
  @PrimaryGeneratedColumn('uuid')
  id!: string;  // definite assignment assertion

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  language!: string;

  @Column({ default: 'inactive' })
  status!: string;

  @ManyToOne(() => User, (user) => user.apps)
  user!: User;

  @OneToMany(() => Deployment, (deployment) => deployment.app)
  deployments!: Deployment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}