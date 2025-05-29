import { Controller, Get, Param, Post } from '@nestjs/common'

import { RootService } from './root.service'
import { ConfigService } from '@nestjs/config'
import { IConfiguration } from 'src/config'
import { WorkflowOne } from 'src/workflows/one.workflow'
import { Connection, TLSConfig, WorkflowClient, WorkflowStartOptions, Workflow } from '@temporalio/client'
import { WorkflowType } from 'src/workflows'
import { ITemporalConnectionConfig } from 'src/types/ITemporalConnectionConfig'
import { WorkflowWithPython } from 'src/workflows/withPython.workflow'
import { WorkflowTwo } from 'src/workflows/two.workflow'
import { paymentReceivedSignal } from 'src/signals'

@Controller()
export class RootController {
  constructor (
    private readonly appService: RootService,
    private configService: ConfigService<IConfiguration>
  ) {}

  @Get()
  rootRote () {
    return this.appService.getVersion()
  }

  @Post('start/one/:id')
  async startWorkflowOne(@Param('id') purchaseId: number) {
    const workflowType: WorkflowType = 'WorkflowOne'

    const result = await this.start<typeof WorkflowOne>({
      args: [ { purchaseId } ],
      workflowId: `${workflowType}-${purchaseId}`,
    }, workflowType)

    return result
  }

  @Post('execute/one/:id')
  async executeWorkflowOne(@Param('id') purchaseId: number) {
    const workflowType: WorkflowType = 'WorkflowOne'

    const result = await this.execute<typeof WorkflowOne>({
      args: [ { purchaseId } ],
      workflowId: `${workflowType}-${purchaseId}`,
    }, workflowType)

    return result
  }

  @Post('start/two/:id')
  async startWorkflowTwo(@Param('id') purchaseId: number) {
    const workflowType: WorkflowType = 'WorkflowTwo'

    const result = await this.start<typeof WorkflowTwo>({
      args: [ { purchaseId } ],
      workflowId: `${workflowType}-${purchaseId}`,
    }, workflowType)

    return result
  }

  @Post('execute/two/:id')
  async executeWorkflowTwo(@Param('id') purchaseId: number) {
    const workflowType: WorkflowType = 'WorkflowTwo'

    return this.execute<typeof WorkflowTwo>({
      args: [ { purchaseId } ],
      workflowId: `${workflowType}-${purchaseId}`,
    }, workflowType)
  }

  @Post('start/python/:id')
  async startWorkflowWithPython(@Param('id') purchaseId: number) {
    const workflowType: WorkflowType = 'WorkflowWithPython'

    return this.start<typeof WorkflowWithPython>({
      args: [],
      workflowId: `${workflowType}-${purchaseId}`,
    }, workflowType)
  }

  @Post('paymentReceived/:workflowId')
  async paymentReceived(@Param('workflowId') workflowId: string) {
    const temporalConfig = this.configService.get('temporal', { infer: true })!
    const workflowClient = await createWorkflowClient(temporalConfig)

    const handle = workflowClient.getHandle(workflowId);
    await handle.signal(paymentReceivedSignal, true); // Send false to resume

    await workflowClient.connection.close()
  }

  async execute<T extends Workflow> (opts: Omit<WorkflowStartOptions<T>, 'taskQueue'>, workflowType: WorkflowType) {
    const temporalConfig = this.configService.get('temporal', { infer: true })!
    const workflowClient = await createWorkflowClient(temporalConfig)

    const args = {
      ...opts,
      taskQueue: 'default'
    } as WorkflowStartOptions<T>

    let result = await workflowClient.execute<T>(workflowType, args)
    await workflowClient.connection.close()
    return result
  }

  async start<T extends Workflow> (opts: Omit<WorkflowStartOptions<T>, 'taskQueue'>, workflowType: WorkflowType) {
    const temporalConfig = this.configService.get('temporal', { infer: true })!
    const workflowClient = await createWorkflowClient(temporalConfig)

    const args = {
      ...opts,
      taskQueue: 'default'
    } as WorkflowStartOptions<T>

    let result = await workflowClient.start<T>(workflowType, args)
    await workflowClient.connection.close()
    return result
  }
}

export async function createWorkflowClient({ namespace, host, port, crt, pem }: ITemporalConnectionConfig): Promise<WorkflowClient> {

  const isLocalInstance = host === 'localhost'

  if (!isLocalInstance && !namespace) {
    throw new Error('Temporal namespace is not defined');
  }

  if (!port) {
    throw new Error('Temporal port is not defined');
  }

  const tls = isLocalInstance ? undefined : getTlsConfing({ crt, pem })

  const connection = await Connection.connect({
    address: `${host}:${port}`,
    tls,
  })

  return new WorkflowClient({ connection })
}

function getTlsConfing({ crt, pem }: {crt: string, pem: string }): TLSConfig {

  if (!crt) throw new Error('Temporal crt is not defined')
  if (!pem) throw new Error('Temporal pem is not defined')

  return {
    clientCertPair: {
      crt: Buffer.from(crt.replace(/\\n/g, `\n`)),
      key: Buffer.from(pem.replace(/\\n/g, `\n`)),
    }
  }
}
