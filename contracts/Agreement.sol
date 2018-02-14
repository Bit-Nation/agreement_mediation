import "./Mediation.sol";

pragma solidity ^0.4.18;

contract Agreement {

    address public creator;
    address public contractor;
    bool public accepted;
    bool public creatorAccepted;
    bool public contractorAccepted;
    bool public terminated;

    // EVENTS
    event AgreementInitiated(address indexed agreementAddress, address indexed contractorAddress);
    event AgreementSigned(address indexed signee);
    event AgreementTerminated(address indexed agreementAddress);
    event MediationStarted(address indexed agreementAddress, address indexed creator, address indexed contractor, address mediationAddress);

    function Agreement(address _creator, address _contractor) public payable {
        creator = _creator;
        contractor = _contractor;
    }

    function () public payable {
    }

    function acceptAgreement() public {
        require(msg.sender == contractor);
        accepted = true;
        AgreementInitiated(this, msg.sender);
    }

    function endAgreement() public {

        require(msg.sender == contractor || msg.sender == creator);
        require(!terminated);

        if (msg.sender == contractor) {
            contractorAccepted = true;
            AgreementSigned(contractor);
        } else if (msg.sender == creator){
            creatorAccepted = true;
            AgreementSigned(creator);
        }

        if (contractorAccepted && creatorAccepted) {
            contractor.transfer(this.balance);
            terminated = true;
            AgreementTerminated(this);
        }

    }

    function startMediation() public {

        require(msg.sender == contractor || msg.sender == creator);
        require(!terminated);

        Mediation mediation = new Mediation(creator,  contractor);

        mediation.transfer(this.balance);

        MediationStarted(this, creator, contractor, mediation);

    }

    function getBalance() public constant returns (uint) {
        return this.balance;
    }

}
