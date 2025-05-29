import { ConsoleLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  NativeConnection,
  Runtime,
  type TLSConfig,
  Worker,
  type WorkerOptions,
} from '@temporalio/worker'

import { activities } from './activities'

import { AppModule } from './app.module'
import { envs } from './config/environmentVariables'

async function bootstrap () {
  // Create app context early to get logger
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: false,
  })

  // Initialize logger right away for use throughout bootstrap
  const logger = await app.resolve(ConsoleLogger)
  // Configure NestJS to use our logger
  app.useLogger(logger)

  // Worker options without the unnecessary telemetryOptions (since it's now at Runtime level)
  const workerOptions = {
    taskQueue: 'default',
    activities,
    workflowsPath: require.resolve('./workflows'),
  } satisfies WorkerOptions

  const namespace = envs.TEMPORAL_NAMESPACE
  const address = `${envs.TEMPORAL_HOST}:${envs.TEMPORAL_PORT}`
  logger.debug(
    `Temporal client for: ${JSON.stringify({ address, namespace }, null, -1)}`,
    'Bootstrap',
  )

  if (!address.startsWith('localhost') && !namespace) {
    throw new Error('Temporal namespace is not defined')
  }

  const tls = address.startsWith('localhost') ? undefined : getTlsConfing()
  const connection = await NativeConnection.connect({
    address,
    tls,
  })

  await app.listen(3000, () => console.log('Running'))

  const worker = await Worker.create({
    ...workerOptions,
    namespace,
    connection,
  })

  return await worker.run()
}

function getTlsConfing (): TLSConfig {
  const crt = envs.TEMPORAL_CRT
  const pem = envs.TEMPORAL_PEM

  if (!crt) throw new Error('Temporal crt is not defined')
  if (!pem) throw new Error('Temporal pem is not defined')

  return {
    clientCertPair: {
      crt: Buffer.from(crt.replace(/\\n/g, '\n')),
      key: Buffer.from(pem.replace(/\\n/g, '\n')),
    },
  }
}

bootstrap()
