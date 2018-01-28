let AgreementRegistry = artifacts.require('./AgreementRegistry.sol');
let Agreement = artifacts.require('./Agreement.sol');

contract('Agreement creation testing', accounts => {

	let agreementRegistry = {};
	let agreementAddress;
	let agreement;

	it  ('Should be able to create an agreement between accounts[0] and accounts[1]', function() {

		return AgreementRegistry.deployed().then(function(instance) {
			agreementRegistry = instance;
			return agreementRegistry.startAgreement(accounts[1], {from: accounts[0], value: web3.toWei(0.1, "ether")});
		}).then(function(txReceipt) {
			assert.equal(txReceipt.logs.length, 1, "There should have been one event fired");
			assert.equal(txReceipt.logs[0].event, "AgreementCreated", "The event emitted should be AgreementCreated");
			assert.equal(txReceipt.logs[0].args.creator, accounts[0], "The creator should be ", accounts[0]);
			assert.equal(txReceipt.logs[0].args.contractor, accounts[1], "The contractor should be ', accounts[1]");
			assert.equal(txReceipt.logs[0].args.balance, web3.toWei(0.1, "ether"), "The balance should be ", web3.toWei(0.1, "ether"));
			agreementAddress = txReceipt.logs[0].args.agreementAddress;
			agreement = Agreement.at(agreementAddress);

			return agreement.getBalance();
		}).then(function(balance) {
			assert.equal(balance.toNumber(), web3.toWei(0.1, "ether"), "The current balance of the agreement should be " + web3.toWei(0.1, "ether"));

			// Accept the agreement from the contractor
			return agreement.acceptAgreement({from: accounts[1]})
		}).then(function(txReceipt) {
			assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
			assert.equal(txReceipt.logs[0].event, "AgreementInitiated", "The event fired should have been AgreementInitiated");
			assert.equal(txReceipt.logs[0].args.agreementAddress, agreementAddress, "The agreement address should be ", agreementAddress);
			assert.equal(txReceipt.logs[0].args.contractorAddress, accounts[1], "The contractor should be ", accounts[1]);
		})

	})

});
