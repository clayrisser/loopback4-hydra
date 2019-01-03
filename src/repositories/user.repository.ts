import { DefaultCrudRepository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { MemoryDataSource } from '../datasources';
import { User } from '../models';

const { env } = process;
const datasource = env.DATASOURCE || 'memory';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject(`datasources.${datasource}`) dataSource: MemoryDataSource
  ) {
    super(User, dataSource);
  }
}
