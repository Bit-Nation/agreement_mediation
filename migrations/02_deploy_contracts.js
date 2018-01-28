const AgreementRegistry = artifacts.require('AgreementRegistry');

module.exports = function(deployer) {
	deployer.deploy(AgreementRegistry);
};
