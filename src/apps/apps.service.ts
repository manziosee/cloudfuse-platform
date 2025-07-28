import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from './entities/app.entity';
import { CreateAppDto } from './dto/create-app.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private readonly appsRepository: Repository<App>,
  ) {}

  async create(createAppDto: CreateAppDto, user: User): Promise<App> {
    const app = this.appsRepository.create({
      ...createAppDto,
      user,
    });
    return this.appsRepository.save(app);
  }

  async findAllByUser(userId: string): Promise<App[]> {
    return this.appsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string, userId: string): Promise<App | undefined> {
  const app = await this.appsRepository.findOne({
    where: { id, user: { id: userId } },
    relations: ['user'],
  });
  return app ?? undefined; // convert null to undefined
}

  async update(id: string, updateData: Partial<App>, userId: string): Promise<App> {
  await this.appsRepository.update({ id, user: { id: userId } }, updateData);
  const updatedApp = await this.appsRepository.findOne({ where: { id, user: { id: userId } } });
  if (!updatedApp) {
    throw new Error('App not found after update');
  }
  return updatedApp;
}

  async remove(id: string, userId: string): Promise<void> {
    await this.appsRepository.delete({ id, user: { id: userId } });
  }
}