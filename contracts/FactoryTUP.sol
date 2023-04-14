// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20PresetFixedSupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetFixedSupplyUpgradeable.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract FactoryTUP {
    address public immutable tokenImplementation;

    constructor() {
        tokenImplementation = address(new ERC20PresetFixedSupplyUpgradeable());
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply,
        address owner
    ) external returns (address) {
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            tokenImplementation,
            msg.sender,
            ""
        );
        ERC20PresetFixedSupplyUpgradeable(address(proxy)).initialize(
            name,
            symbol,
            initialSupply,
            owner
        );
        return address(proxy);
    }
}
