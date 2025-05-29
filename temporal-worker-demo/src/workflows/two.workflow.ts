import { proxyActivities, type ActivityOptions } from '@temporalio/workflow'
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

const activities2 = proxyActivities<{ sendEmail: (args: { email: string, subject: string, text: string }) => Promise<{ sent: boolean }>}>({
  ...PROXY_ACTIVITY_INIT_CONFIG,
  taskQueue: 'default2'
})


export const WorkflowTwo = async ({
  purchaseId,
}: {
  purchaseId: number;
}) => {
  const approvalId = await activities.approvePurchase(purchaseId)
  const result = await activities2.sendEmail({ email: 'some@email.com', subject: 'Purchase approved', text: `Purchase ${purchaseId} approved` })
  return approvalId
}
