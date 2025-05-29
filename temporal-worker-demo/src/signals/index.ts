import { defineSignal } from '@temporalio/workflow';

// Define signals for pausing and resuming
export const paymentReceivedSignal = defineSignal<[boolean]>('paymentReceived');
