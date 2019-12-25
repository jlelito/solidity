const RockPaperScissors = artifacts.require("RockPaperScissors.sol");

module.exports = async function(deployer) {
  await deployer.deploy(RockPaperScissors);
  
};

