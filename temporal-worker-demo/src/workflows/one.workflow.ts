
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


export const WorkflowOne = async ({
  purchaseId,
}: {
  purchaseId: number;
}) => {
  const approvalId = await activities.approvePurchase(purchaseId)
  await activities.generateAndSendPurchasePdf(purchaseId)
  return approvalId
}
