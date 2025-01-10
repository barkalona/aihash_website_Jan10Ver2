import { JsonRpcProvider, Ed25519Keypair, RawSigner } from '@mysten/sui.js';

export class TestEnvironment {
    private provider: JsonRpcProvider;
    private testAccounts: Map<string, Ed25519Keypair>;

    constructor() {
        this.provider = new JsonRpcProvider();
        this.testAccounts = new Map();
    }

    async createTestAccount(): Promise<string> {
        const keypair = Ed25519Keypair.generate();
        const address = keypair.getPublicKey().toSuiAddress();
        this.testAccounts.set(address, keypair);
        
        // Request test tokens from faucet
        await this.provider.requestSuiFromFaucet(address);
        
        return address;
    }

    async deployTestToken(): Promise<string> {
        const [firstAccount] = this.testAccounts.values();
        if (!firstAccount) throw new Error('No test accounts available');

        const signer = new RawSigner(firstAccount, this.provider);
        
        // Deploy test token contract
        const compiledModules = await this.provider.devInspectTransactionBlock({
            sender: firstAccount.getPublicKey().toSuiAddress(),
            data: {
                kind: 'publish',
                modules: ['mining_token'],
            },
        });

        const response = await signer.signAndExecuteTransactionBlock({
            transactionBlock: compiledModules,
        });

        return response.digest;
    }

    async runTestScenario(): Promise<void> {
        // Create test accounts
        const owner = await this.createTestAccount();
        const user1 = await this.createTestAccount();
        const user2 = await this.createTestAccount();

        // Deploy test token
        const contractAddress = await this.deployTestToken();
        console.log('Test token deployed at:', contractAddress);

        // Mint tokens for testing
        await this.mintTestTokens(owner, user1, 100);
        await this.mintTestTokens(owner, user2, 50);

        // Simulate mining rewards distribution
        await this.simulateRewardsDistribution(owner, [user1, user2]);
    }

    private async mintTestTokens(owner: string, recipient: string, amount: number): Promise<void> {
        const ownerKeypair = this.testAccounts.get(owner);
        if (!ownerKeypair) throw new Error('Owner account not found');

        const signer = new RawSigner(ownerKeypair, this.provider);
        
        await signer.signAndExecuteTransactionBlock({
            transactionBlock: {
                kind: 'moveCall',
                data: {
                    target: `${process.env.VITE_CONTRACT_ADDRESS}::mining_token::mint_token`,
                    arguments: [amount, amount * 10],
                },
            },
        });
    }

    private async simulateRewardsDistribution(owner: string, recipients: string[]): Promise<void> {
        // Implement rewards distribution testing logic
    }
}

export const testEnvironment = new TestEnvironment();