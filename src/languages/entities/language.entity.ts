import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column('simple-array')
  versions!: string[];

  @Column('json', { nullable: true })
  metadata!: {
    dockerImagePattern?: string;
    defaultVersion?: string;
    packageManager?: string;
  };
}