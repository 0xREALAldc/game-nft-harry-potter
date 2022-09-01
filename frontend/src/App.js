import React, { useEffect, useState } from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"

// Constants
const TWITTER_HANDLE = "REAL_aldc"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

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
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🪄 Wicked Wizards 🪄</p>
          <p className="sub-text">Join now in the battle agains the dark forces!</p>
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
