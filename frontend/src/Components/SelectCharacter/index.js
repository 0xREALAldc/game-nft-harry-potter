import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";

const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
      <h2>Mint your character</h2>
      <div className="select-character-container character-grid">
        <div className="character-grid character-item">
          {/* <img 
             src="" 
             alt="Sirius Black" 
             className="character-item"
           /> */}

          {/* <p className="character-item name-container">
            Sirius Black
          </p>

          <button
            className="character-mint-button">
              Mint
            </button> */}

        </div>

        <div className="character-grid character-item">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrPf1xAS34CuVJKgukqWzrQwFoeK8MLKnyKA&usqp=CAU" 
            alt="Sirius Black" 
            className="character-item"
          />

          <p className="character-item name-container">
            Sirius Black
          </p>

          <button
            className="character-mint-button">
              Mint
            </button>

        </div>

        <div className="character-grid character-item">
          {/* <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrPf1xAS34CuVJKgukqWzrQwFoeK8MLKnyKA&usqp=CAU" 
            alt="Sirius Black" 
            className="character-item"
          />

          <p className="character-item name-container">
            Sirius Black
          </p>

          <button
            className="character-mint-button">
              Mint
            </button> */}

        </div>
      </div>
    </div>
  );
};

export default SelectCharacter;