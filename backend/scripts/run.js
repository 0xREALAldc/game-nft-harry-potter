const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Harry Potter", "Sirius Black", "Hermione Granger"],
    [
      "http://images5.fanpop.com/image/polls/921000/921207_1325987759335_full.jpg?v=1325987891",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrPf1xAS34CuVJKgukqWzrQwFoeK8MLKnyKA&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcXCwGjc-0WkpjeFfRgS0DjeyzqKKNQqoGrTJo5l3f6KZDEsrZ2aLSf_3YnMjwDXqJiv4&usqp=CAU"
    ],
    [250, 180, 220], //hp 
    [195, 239, 210] //attack damage 
  ); 
  await gameContract.deployed();
  console.log("Contract address: ", gameContract.address);

  let txn;
  // mint a NFT for the character in the index 2
  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();

  // we retrieve the URI value from the NFT, we know its index 1 because here will always be the first one
  let returnedTokenUri = await gameContract.tokenURI(1); //tokenURI is a inherited method from ERC721 that retrieves the NFT metadata
  console.log("Token URI: ", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();