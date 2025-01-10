module my_first_package::counter {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Counter has key {
        id: UID,
        value: u64
    }

    public fun new(ctx: &mut TxContext): Counter {
        Counter {
            id: object::new(ctx),
            value: 0
        }
    }

    public entry fun create(ctx: &mut TxContext) {
        let counter = new(ctx);
        transfer::transfer(counter, tx_context::sender(ctx));
    }

    public entry fun increment(counter: &mut Counter) {
        counter.value = counter.value + 1;
    }
}