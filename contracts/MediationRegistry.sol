import "./Mediation.sol";

pragma solidity ^0.4.18;

contract MediationRegistry {

    event MediationCreated(address indexed creator, address indexed mediated, address mediationAddress);

    function startMediation(address _mediated) public payable returns (address) {

        require(msg.value > 0 && _mediated != address(0));

        Mediation mediation = new Mediation(msg.sender, _mediated);

        mediation.transfer(msg.value);

        MediationCreated(msg.sender, _mediated, mediation);

        return address(mediation);

    }

}
