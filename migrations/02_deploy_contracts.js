const AgreementContract = artifacts.require('Agreement');

module.exports = function(deployer) {
	deployer.deploy(AgreementContract);
};
