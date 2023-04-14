// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20PresetFixedSupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetFixedSupplyUpgradeable.sol";

contract FactoryImplementation {
    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address) {
        ERC20PresetFixedSupplyUpgradeable token = new ERC20PresetFixedSupplyUpgradeable();
        token.initialize(name, symbol, initialSupply, msg.sender);
        return address(token);
    }
}
