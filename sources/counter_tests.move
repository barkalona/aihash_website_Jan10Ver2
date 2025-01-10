#[test_only]
module my_first_package::counter_tests {
    use sui::test_scenario;
    use my_first_package::counter::{Self, Counter};

    #[test]
    fun test_counter() {
        let owner = @0xCAFE;
        let scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        // Create the counter
        test_scenario::next_tx(scenario, owner);
        {
            counter::create(test_scenario::ctx(scenario));
        };

        // Increment the counter
        test_scenario::next_tx(scenario, owner);
        {
            let counter = test_scenario::take_from_sender<Counter>(scenario);
            counter::increment(&mut counter);
            test_scenario::return_to_sender(scenario, counter);
        };

        // Verify counter value
        test_scenario::next_tx(scenario, owner);
        {
            let counter = test_scenario::take_from_sender<Counter>(scenario);
            assert!(counter.value == 1, 0);
            test_scenario::return_to_sender(scenario, counter);
        };

        test_scenario::end(scenario_val);
    }
}