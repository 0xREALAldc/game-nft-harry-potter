import React, { useEffect } from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"

// Constants
const TWITTER_HANDLE = "REAL_aldc"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {

  // check if we have metamask
  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("You need metamask extension to connect!");
      return;
    } else {
      console.log("We have metamask!");
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
