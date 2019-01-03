import * as config from './memory.datasource.json';

const { env } = process;
export const memoryConfig = {
  ...config,
  file: env.MEMORY_FILE || config.file
};
