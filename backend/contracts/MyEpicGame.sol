// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// contract NFT for inheritance
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// helpers from OpenZeppelin
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// helper to encode base64
import "./libraries/Base64.sol";

import "hardhat/console.sol";

contract MyEpicGame is ERC721 {

  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  // tokenId is the unique identifier for the NFT, that goes like 1,2,3,4.....
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  // mapping to store the NFT id with its attributes
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  
  // mapping to store the address from the holder of the nft
  mapping(address => uint256) nftHolders;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDamage
  ) 
    ERC721("Wicked Wizards", "WICK")
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
    // we increment the ID here so we start with the ID in 1 
      _tokenIds.increment();
  }

  // mint function for characters
  function mintCharacterNFT(uint256 _characterIndex) external {
    // we get the current tokenId (1 because we incremented above)
    uint256 newItemId = _tokenIds.current();

    // assigns the tokenId for the address that called the mint function
    _safeMint(msg.sender, newItemId);

    // we add the character in the mapping to keep track 
    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("NFT minted with tokenId %s and characterIndex %s", newItemId, _characterIndex);

    // keep track of the new owner 
    nftHolders[msg.sender] = newItemId;

    // increment the ID for the next mint
    _tokenIds.increment();
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is a NFT that gives you access to the Wicked Wizards game. Enjoy!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value":', strHp, ', "max_value":', strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage, '} ]}'
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    return output;
  }
}