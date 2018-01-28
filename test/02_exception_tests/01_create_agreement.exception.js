let AgreementRegistry = artifacts.require('./AgreementRegistry.sol');

contract('Agreement creation exception testing', accounts => {

	let agreementRegistry = {};

	it('Should fail to create an agreement with an empty contractor field', function() {

		return AgreementRegistry.deployed().then(function(instance) {
			agreementRegistry = instance;
			return agreementRegistry.startAgreement(0x0, {from: accounts[0], value: web3.toWei(0.1, "ether")});
		})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should fail to create an agreement with a 0 balance', function() {
		return AgreementRegistry.deployed().then(function(instance) {
			agreementRegistry = instance;
			return agreementRegistry.startAgreement(accounts[1], {from: accounts[0]});
		})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})
	})

});
