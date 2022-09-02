const CONTRACT_ADDRESS = "0xd717D9b23D8600af8A11666EBE6AA5dd0625C9e1";

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