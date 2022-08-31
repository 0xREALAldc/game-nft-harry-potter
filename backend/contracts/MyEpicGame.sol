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

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  struct BigBoss {
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
  BigBoss public bigBoss;

  // mapping to store the NFT id with its attributes
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  
  // mapping to store the address from the holder of the nft
  mapping(address => uint256) nftHolders;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDamage,
    string memory bossName,
    string memory bossImageURI,
    uint256 bossHp,
    uint256 bossAttackDamage
  ) 
    ERC721("Wicked Wizards", "WICK")
  {
    // initialize the big boss
    bigBoss = BigBoss({
      name: bossName,
      imageURI: bossImageURI,
      hp: bossHp,
      maxHp: bossHp,
      attackDamage: bossAttackDamage
    });

    console.log("Boss initialized with success %s with HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

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

    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
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

  function attackBoss() public {
    // we will get the state of the NFT
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    console.log("\nPlayer of character %s is going to attack. He has %s HP and %s of attack damage", player.name, player.hp, player.attackDamage);
    console.log("Boss %s has %s HP and %s of attack damage", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

    // require the NFT player has HP > 0
    require(player.hp > 0, "Error: player must have HP to attack the boss");
    
    // require the BOSS has HP > 0
    require(bigBoss.hp > 0, "Error: boss must have HP to be attacked");

    // allow that the NFT attack the BOSS
    if (bigBoss.hp < player.attackDamage) {
      bigBoss.hp = 0;
    } else {
      bigBoss.hp = bigBoss.hp - player.attackDamage;
    }

    // allow that the BOSS attack the NFT
    if (player.hp < bigBoss.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - bigBoss.attackDamage;
    }

    console.log("Player has attacked Boss. Boss now has %s HP left", bigBoss.hp);
    console.log("Boss has attacked the player. Player now has %s HP left", player.hp);

    emit AttackComplete(bigBoss.hp, player.hp);
  }

  function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
    // we get the tokenId of player NFT
    uint256 userNftTokenId = nftHolders[msg.sender];
    // if we have in the hashmap, we return the NFT character
    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    } else { // otherwise, we return nothing
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function getBigBoss() public view returns (BigBoss memory) {
    return bigBoss;
  }
}