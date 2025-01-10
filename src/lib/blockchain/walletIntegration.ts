import { JsonRpcProvider } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export class WalletIntegration {
    private provider: JsonRpcProvider;

    constructor() {
        this.provider = new JsonRpcProvider({
            fullnode: 'https://fullnode.testnet.sui.io',
        });
    }

    async mintToken(shares: number, miningPower: number): Promise<string> {
        try {
            const tx = new TransactionBlock();
            
            tx.moveCall({
                target: `${import.meta.env.VITE_CONTRACT_ADDRESS}::mining_token::mint_token`,
                arguments: [
                    tx.pure(shares),
                    tx.pure(miningPower)
                ],
            });

            return tx.blockData.sender;
        } catch (error) {
            console.error('Failed to mint token:', error);
            throw error;
        }
    }
}