import * as config from './mongo.datasource.json';

const { env } = process;
export default {
  ...config,
  database: env.MONGO_DATABASE || config.database,
  host: env.MONGO_HOST || config.host,
  password: env.MONGO_PASSWORD || config.password,
  port: Number(env.MONGO_PORT || config.port),
  url: env.MONGO_URL || config.url,
  user: env.MONGO_USER || config.user
};
