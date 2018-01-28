let AgreementRegistry = artifacts.require('./AgreementRegistry.sol');
let Agreement = artifacts.require('./Agreement.sol');

contract('Accept agreement testing', accounts => {

	let agreementRegistry = {};
	let agreementAddress;
	let agreement;

	before (function() {

		return AgreementRegistry.deployed().then(function(instance) {
			agreementRegistry = instance;
			return agreementRegistry.startAgreement(accounts[1], {from: accounts[0], value: web3.toWei(0.1, "ether")});
		}).then(function(txReceipt) {
			agreementAddress = txReceipt.logs[0].args.agreementAddress;
			agreement = Agreement.at(agreementAddress);
			return agreement.acceptAgreement({from: accounts[1]})
		})

	});

	it ('Should fail to allow an unknown party to end the agreement', function() {

		return agreement.endAgreement({from: accounts[2]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it ('Should fail to allow a party to end twice', function() {

		return agreement.endAgreement({from: accounts[0]})
			.then(function(txReceipt) {

				return agreement.endAgreement({from: accounts[1]});
			}).then(function(txReceipt) {

				return agreement.endAgreement({from: accounts[0]});
			}).then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

});
