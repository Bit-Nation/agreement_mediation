import "./Agreement.sol";

pragma solidity ^0.4.18;

contract AgreementRegistry {

    mapping (address => address[]) agreements;

    // EVENTS
    event AgreementCreated(address indexed creator, address indexed contractor, uint balance, address agreementAddress);

    function startAgreement(address _contractor) public payable returns (address) {

        require(msg.value > 0 && _contractor != address(0));

        Agreement agreement = new Agreement(msg.sender, _contractor);

        agreements[msg.sender].push(agreement);

        agreement.transfer(msg.value);

        AgreementCreated(msg.sender, _contractor, msg.value, agreement);

        return address(agreement);

    }

}
