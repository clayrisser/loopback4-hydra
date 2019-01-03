import * as config from './memory.datasource.json';

const { env } = process;
export default {
  ...config,
  file: env.MEMORY_FILE || config.file
};
