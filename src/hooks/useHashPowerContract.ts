import { TransactionBlock } from '@mysten/sui.js';
import { useWalletKit } from '@mysten/wallet-kit';

export interface HashPowerOrder {
  algorithm: string;
  hashPower: number;
  pricePerTH: number;
  duration: number;
}

export function useHashPowerContract() {
  const { signAndExecuteTransactionBlock } = useWalletKit();

  const purchaseHashPower = async (order: HashPowerOrder) => {
    try {
      const txb = new TransactionBlock();
      
      // Create the purchase transaction
      txb.moveCall({
        target: `${process.env.VITE_CONTRACT_ADDRESS}::hash_power::purchase`,
        arguments: [
          txb.pure(order.algorithm),
          txb.pure(order.hashPower),
          txb.pure(order.pricePerTH),
          txb.pure(order.duration),
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });

      return result;
    } catch (error) {
      console.error('Error purchasing hash power:', error);
      throw error;
    }
  };

  return { purchaseHashPower };
}