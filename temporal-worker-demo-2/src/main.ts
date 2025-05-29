import {
  NativeConnection,
  type TLSConfig,
  Worker,
  type WorkerOptions,
} from '@temporalio/worker'

import { envs } from './config/environmentVariables'
import { console } from 'inspector'

async function bootstrap () {

  // Worker options without the unnecessary telemetryOptions (since it's now at Runtime level)
  const workerOptions = {
    taskQueue: 'default2',
    activities: {
      sendEmail: (args: { email: string, subject: string, text: string }) => {
        console.log(`activityFromAnotherNodeJsWorker with arguments ${args}`)
        return { sent: true }
      }
    }
  } satisfies WorkerOptions

  const namespace = envs.TEMPORAL_NAMESPACE
  const address = `${envs.TEMPORAL_HOST}:${envs.TEMPORAL_PORT}`

  if (!address.startsWith('localhost') && !namespace) {
    throw new Error('Temporal namespace is not defined')
  }

  const tls = address.startsWith('localhost') ? undefined : getTlsConfing()
  const connection = await NativeConnection.connect({
    address,
    tls,
  })

  const worker = await Worker.create({
    ...workerOptions,
    namespace,
    connection,
  })

  console.log(`We're running`)

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
