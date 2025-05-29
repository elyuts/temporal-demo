import { condition, proxyActivities, setHandler, type ActivityOptions } from '@temporalio/workflow'
import { paymentReceivedSignal } from 'src/signals'
import { type Activities } from 'src/types'

const MINUTES3_IN_MS = 3 * 60 * 1000

const PROXY_ACTIVITY_INIT_CONFIG = {
  startToCloseTimeout: MINUTES3_IN_MS,
  retry: { maximumAttempts: 3 },
} satisfies ActivityOptions

const activities = proxyActivities<Activities>({
  ...PROXY_ACTIVITY_INIT_CONFIG,
  taskQueue: 'default'
})

const pythonActivities = proxyActivities<{ say_hello: (name: string) => Promise<string> }>({
  ...PROXY_ACTIVITY_INIT_CONFIG,
  taskQueue: 'python',
})

export const WorkflowWithPython = async () => {
  let isPaid = false

  setHandler(paymentReceivedSignal, (paid: boolean) => {
    isPaid = paid;
  });

  const greeting1 = await pythonActivities.say_hello('Eugene')
  const aaa = 222
  const greeting2 = await pythonActivities.say_hello('Eugene')
  const purchaseId = await activities.createPurchase()

  await condition(() => isPaid)

  await activities.generateAndSendPurchasePdf(purchaseId)

}
