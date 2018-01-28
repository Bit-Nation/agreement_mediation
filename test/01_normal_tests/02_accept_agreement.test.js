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
		})

	});

	it ('Should allow accounts[1] to accept the agreement', function() {

		return agreement.acceptAgreement({from: accounts[1]})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been 1 event emitted");
				assert.equal(txReceipt.logs[0].event, "AgreementInitiated", "The event emitted should have been AgreementInitiated");
				assert.equal(txReceipt.logs[0].args.agreementAddress, agreementAddress, "The agreement address should have been " + agreementAddress);
				assert.equal(txReceipt.logs[0].args.contractorAddress, accounts[1], "The contractor address should have been " + accounts[1]);

				return agreement.accepted();
			}).then(function(isAccepted) {
				assert.isTrue(isAccepted, "The agreement should have been accepted");
			})

	})

});
