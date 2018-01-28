let AgreementRegistry = artifacts.require('./AgreementRegistry.sol');
let Agreement = artifacts.require('./Agreement.sol');

contract('Accept agreement exception testing', accounts => {

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
		})

	});

	it ('Should fail to allow someone who isnt the contractor accept the agreement', function() {

		return agreement.acceptAgreement({from: accounts[3]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	})

});
