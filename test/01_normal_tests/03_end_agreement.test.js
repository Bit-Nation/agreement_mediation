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

	it ('Should allow the two parties to end the agreement', function() {

		let account1initialBalance;
		let account1afterBalance;

		return agreement.endAgreement({from: accounts[0]})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "AgreementSigned", "The event fired should have been AgreementSigned");
				assert.equal(txReceipt.logs[0].args.signee, accounts[0], "The signee should hav been " + accounts[0]);

				account1initialBalance = web3.eth.getBalance(accounts[1]);

				return agreement.endAgreement({from: accounts[1]});
			}).then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 2, "There should have been two events emitted");
				assert.equal(txReceipt.logs[0].event, "AgreementSigned", "The event fired should have been AgreementSigned");
				assert.equal(txReceipt.logs[1].event, "AgreementTerminated", "The second event fired should have been AgreementTerminated");
				assert.equal(txReceipt.logs[0].args.signee, accounts[1], "The first events signee should have been " + accounts[1]);
				assert.equal(txReceipt.logs[1].args.agreementAddress, agreementAddress, "The terminated address should have been " + agreementAddress);

				account1afterBalance = web3.eth.getBalance(accounts[1]);
				assert.isTrue(account1afterBalance.toNumber() > account1initialBalance.toNumber(), "Account 1 should be richer after the agreement is terminated");

				return agreement.terminated();
			}).then(function(terminated) {
				assert.isTrue(terminated, "The agreement should have been terminated");
			})

	})

});
