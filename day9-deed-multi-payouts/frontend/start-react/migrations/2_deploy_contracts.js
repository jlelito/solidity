const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");

module.exports = function(deployer, accounts) {
  deployer.deploy(DeedMultiPayouts, "0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4",
   "0xE8C4e9611B89ffDD1734cE759692518F765Cf465",
    50,
    {value: web3.utils.toWei('1', 'Ether')});
};


//.send({from: deployer, value: web3.utils.toWei('1', 'Ether')})