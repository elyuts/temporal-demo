export const activities = {
  async createPurchase(): Promise<number> {
    console.log('Creating new purchase');
    return Math.random()*1000
  },

  async approvePurchase(
    purchaseId: number
  ): Promise<number> {
    console.log(`PurchaseId: ${purchaseId} approved`);
    return 777
  },

  async rejectPurchase(
    purchaseId: number
  ): Promise<void> {
    console.log(`Purchase '${purchaseId}' rejected`);
  },

  async cancelPurchase(purchaseId: number) {
    console.log(`Purchase '${purchaseId}' is cancelled`);
  },

  async generateAndSendPurchasePdf(
    purchaseId: number,
  ): Promise<void> {
    console.log('Generating and sending purchase PDF for purchaseId:', purchaseId);
    throw new Error('Something went wrong')
  },
}
