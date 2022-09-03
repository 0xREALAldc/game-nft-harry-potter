import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found!");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Retrieving the characters for players to mint...");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn: ", charactersTxn);

        const characters = charactersTxn.map((characterData) => 
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.log("Something went wrong when retrieving the characters: ", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(`CharacterNFTMinted - sender: ${sender}, tokenId: ${tokenId.toNumber()}, characterIndex: ${characterIndex.toNumber()}`);
      
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));

        alert(
          `Your NFT is minted -- check here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`
        );
      }
    };

    if (gameContract) {
      getCharacters();

      // here we listen to the event that is emitted when a NFT is minted
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    // when the component is destroyed, we clear this listener
    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
    
  }, [gameContract]);

  const renderCharacters = () => characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>

      <img src={character.imageURI} alt={character.name} />
      <button 
        type="button"
        className="character-mint-button"
        onClick={mintCharacterNFTAction(index)}
        >{`Mint ${ character.name}`}
      </button>
    </div>
  ));

  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log("Minting character...");

        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn: ", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterActionError: ", error);
    }
  };

  return (
    <div className="select-character-container">
      <h2>Mint your hero</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  );
};

export default SelectCharacter;