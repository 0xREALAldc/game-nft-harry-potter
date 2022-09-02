import React, { useEffect, useState } from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import { ethers } from 'ethers';  

import "./App.css" 
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";

// Constants
const TWITTER_HANDLE = "REAL_aldc";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  // check if we have metamask
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("You need metamask extension to connect!");
        return;
      } else {
        console.log("We have metamask!");
      }

      //check if we are authorized to access the accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // user can have more than one account authorized, we get the first one
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Wallet connected: ", account);
        setCurrentAccount(account);
      } else {
        console.log("we couldn find a connected wallet!");
      }
    } catch (error) {
      console.log("ERROR: %s", error);
    }
  };

  const checkNetwork = async () => {
    // try {
    //   if (window.ethereum.networkVersion !== "5") {
    //     alert("Please connect to Goerli!");
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // method to render the content dynamically
  const renderContent = () => {
    // first we check to see if the wallet is connected
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
            <img
              src="https://i.pinimg.com/originals/24/83/9c/24839c59c39c8c9795781d77fc884e6d.gif"
              alt="Hogwarts Battle"
            />

            <button 
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}>
                Connect Wallet
            </button>
          </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("You need to install metamask extension!");
        return;
      }

      // method to request access to account 
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // we will log the public address when the user authorize
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkNetwork();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking if the address has a NFT needed for the game: ", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {  //TODO later we can check here if HP > 0 to allow a person to mint a new NFT if the one he has is already DEAD
        console.log("User has a NFT!", txn);
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("User doesnt has a NFT!");
      }
    };

    // we only run this if we have a wallet connected
    if (currentAccount) {
      console.log("Connected account: ", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🪄 Wicked Wizards 🪄</p>
          <p className="sub-text">Join now in the battle agains the dark forces!</p>
          
          {renderContent()}

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`construído por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
