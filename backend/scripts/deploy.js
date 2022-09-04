const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Harry Potter", "Sirius Black", "Hermione Granger"],
    [
      "QmaRxxfSdbmd8Vmgv2cbwJBRjDFdWBEEmwQVMiirEg1KGx",
      "QmQbwGqhcR1iDsABYAxgHhfYpqZAmwEbjbHKtfm5zZHszd",
      "Qmc78ubPEyPReFLY7uaPfxwBL58GugunWLHQoTWvWp6utd"
    ],
    [480, 670, 505], //hp 
    [195, 239, 210], //attack damage 
    "Voldemort",
    "QmdThCCChqNUPuiK1F9TvuHMpASSkiB7zXSvoFkXbCs4C8",
    1910,
    390
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