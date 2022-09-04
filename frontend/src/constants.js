const CONTRACT_ADDRESS = "0x064004bCcB6aeB105D19aB772504B9E0043316e8";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};  

export { CONTRACT_ADDRESS, transformCharacterData };