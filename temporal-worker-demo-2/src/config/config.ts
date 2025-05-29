import { envs } from './environmentVariables'
import type { IConfiguration } from './IConfiguration'

// later will be replaced with 'convict'
export const appConfig = () =>
  ({
    env: envs.NODE_ENV,
    stage: envs.STAGE,
    temporal: {
      host: envs.TEMPORAL_HOST,
      port: +envs.TEMPORAL_PORT,
      namespace: envs.TEMPORAL_NAMESPACE,
      crt: envs.TEMPORAL_CRT,
      pem: envs.TEMPORAL_PEM,
    },
  }) as IConfiguration
