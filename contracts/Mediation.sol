pragma solidity ^0.4.18;

contract Mediation {

    address public creator;
    address public contractor;
    address public mediator;

    event MediatorSelected(address indexed mediationAddress, address mediator);
    event MediationEnded(address indexed mediationAddress, address target);

    function Mediation(address _creator, address _contractor) public payable {
        creator = _creator;
        contractor = _contractor;
    }

    function () public payable {
    }

    function SelectMediator(address _mediator) public {
        // Check if both parties agree to the same mediator

        MediatorSelected(this, _mediator);
    }

    function endMediation(address _target) public {
        // Only Callable by the mediator, _target will be the address to send the funds to

        MediationEnded(this, _target);
    }

}
