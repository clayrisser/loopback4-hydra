import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import config from './mongo.config';

export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'mongo';

  constructor(
    @inject('datasources.config.mongo', { optional: true })
    dsConfig: object = config
  ) {
    super(dsConfig);
  }
}
