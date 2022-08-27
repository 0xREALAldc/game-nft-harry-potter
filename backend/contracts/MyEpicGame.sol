// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// contract NFT for inheritance
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// helpers from OpenZeppelin
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract MyEpicGame {
  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  CharacterAttributes[] defaultCharacters;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDamage
    ) 
  {
    // we loop all the characters so we can save their attributes and use after when minting
    for(uint256 i = 0; i < characterNames.length; i+= 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDamage[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Character created: %s com %s de HP, img %s", c.name, c.hp, c.imageURI);
    }
  }
}