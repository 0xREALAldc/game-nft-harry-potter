import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from '../LoadingIndicator';

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);

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
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boxx: ", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      console.log(`Attack complete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      setBoss((prevState) => {
        return {...prevState, hp: bossHp};
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp};
      });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking the bos....");
        
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();

        console.log("attackTxn: ", attackTxn);
        setAttackState("hit");

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Error when attacking the boss..: ", error);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc"> 
            {`${boss.name} has suffered ${characterNFT.attackDamage} of damage!`}
          </div>
        </div>
      )}

      {boss && (
        <div className="boss-container"> 
          <div className={`boss-content ${attackState}`}>
            <h2>{boss.name}</h2>
            <div className="image-content">
              <img 
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`} 
              />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>

          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction} hidden={attackState === "attacking"}>
              {`Attack ${boss.name}`}
            </button>
          </div>

          {attackState === "attacking" && (
            <div className="loading-indicator"> 
              <div>
                <img 
                  src="https://cloudflare-ipfs.com/ipfs/QmW2K1j3nYtpNEc7UYVWeejniPXTHtjX3gcCg8BrC7TeZb"
                  alt="Attacking gif"
                />
                <p>Attacking...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img 
                src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`Attack damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Arena;