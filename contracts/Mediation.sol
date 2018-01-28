pragma solidity ^0.4.18;

contract Mediation {

    address public creator;
    address public mediator;

    function Mediation(address _creator, address _mediator) public payable {
        creator = _creator;
        mediator = _mediator;
    }

    function () public payable {
    }

}
