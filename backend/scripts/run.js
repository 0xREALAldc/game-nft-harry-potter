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