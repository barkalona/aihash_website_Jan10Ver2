import { describe, test, expect, beforeAll } from 'vitest';
import { TestEnvironment } from '../blockchain/testEnvironment';
import { WalletIntegration } from '../blockchain/walletIntegration';

describe('Blockchain Integration Tests', () => {
    let testEnv: TestEnvironment;
    let walletIntegration: WalletIntegration;
    let testAccount: string;

    beforeAll(async () => {
        testEnv = new TestEnvironment();
        walletIntegration = new WalletIntegration();
        testAccount = await testEnv.createTestAccount();
    });

    test('deploys mining token contract', async () => {
        const contractAddress = await testEnv.deployTestToken();
        expect(contractAddress).toBeTruthy();
    });

    test('mints mining tokens', async () => {
        const txHash = await walletIntegration.mintToken(100, 1000);
        expect(txHash).toBeTruthy();
    });

    test('distributes mining rewards', async () => {
        // Setup test data
        const treasuryId = 'test-treasury-id';
        const tokenId = 'test-token-id';
        const amount = 1000;

        const txHash = await walletIntegration.distributeRewards(
            treasuryId,
            tokenId,
            amount
        );
        expect(txHash).toBeTruthy();
    });
});