module aiHash::mining_token {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event;

    // Error codes
    const EInvalidAmount: u64 = 0;
    const EInsufficientBalance: u64 = 1;
    const ENotAuthorized: u64 = 2;

    // Mining Token representing ownership share
    struct MiningToken has key, store {
        id: UID,
        shares: u64,
        mining_power: u64,
        owner: address,
    }

    // Treasury to hold mining rewards
    struct Treasury has key {
        id: UID,
        balance: Balance<sui::sui::SUI>,
        total_shares: u64,
    }

    // Events
    struct TokenMinted has copy, drop {
        token_id: ID,
        owner: address,
        shares: u64,
    }

    struct RewardDistributed has copy, drop {
        recipient: address,
        amount: u64,
    }

    // Initialize the mining platform
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
            total_shares: 0,
        };
        transfer::share_object(treasury);
    }

    // Mint new mining tokens
    public entry fun mint_token(
        shares: u64,
        mining_power: u64,
        ctx: &mut TxContext
    ) {
        assert!(shares > 0, EInvalidAmount);
        
        let token = MiningToken {
            id: object::new(ctx),
            shares,
            mining_power,
            owner: tx_context::sender(ctx),
        };

        event::emit(TokenMinted {
            token_id: object::id(&token),
            owner: tx_context::sender(ctx),
            shares,
        });

        transfer::transfer(token, tx_context::sender(ctx));
    }

    // Distribute mining rewards
    public entry fun distribute_rewards(
        treasury: &mut Treasury,
        token: &MiningToken,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let share_ratio = (token.shares as u128) / (treasury.total_shares as u128);
        let reward_amount = ((amount as u128) * share_ratio) as u64;

        assert!(balance::value(&treasury.balance) >= reward_amount, EInsufficientBalance);
        
        let reward = coin::take(&mut treasury.balance, reward_amount, ctx);
        transfer::transfer(reward, token.owner);

        event::emit(RewardDistributed {
            recipient: token.owner,
            amount: reward_amount,
        });
    }

    // Emergency pause functionality
    public entry fun pause_operations(
        _treasury: &mut Treasury,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == @admin, ENotAuthorized);
        // Implement pause logic
    }
}