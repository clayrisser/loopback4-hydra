import * as bcrypt from 'bcrypt-nodejs';
import { inject } from '@loopback/core';
import {
  DataObject,
  DefaultCrudRepository,
  Options
} from '@loopback/repository';
import { MemoryDataSource, MongoDataSource } from '../datasources';
import { User } from '../models';

const { env } = process;
const datasource = env.DATASOURCE || 'memory';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject(`datasources.${datasource}`)
    dataSource: MemoryDataSource | MongoDataSource
  ) {
    super(User, dataSource);
  }

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    delete entity.id;
    entity.password = bcrypt.hashSync(
      entity.password || '',
      bcrypt.genSaltSync(10)
    );
    return super.create(entity, options);
  }
}
