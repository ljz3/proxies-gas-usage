// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20PresetFixedSupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetFixedSupplyUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract UUPSCompatibleERC20 is
    ERC20PresetFixedSupplyUpgradeable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) public virtual override initializer {
        __ERC20PresetFixedSupply_init(name, symbol, initialSupply, owner);
        __Ownable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

contract UUPSCompatibleERC20V2 is UUPSCompatibleERC20 {
    function version() public pure returns (string memory) {
        return "v2";
    }
}

contract FactoryUUPS {
    address public immutable tokenImplementation;

    constructor() {
        tokenImplementation = address(new UUPSCompatibleERC20());
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address) {
        ERC1967Proxy proxy = new ERC1967Proxy(tokenImplementation, "");
        UUPSCompatibleERC20(address(proxy)).initialize(
            name,
            symbol,
            initialSupply,
            msg.sender
        );
        return address(proxy);
    }
}
