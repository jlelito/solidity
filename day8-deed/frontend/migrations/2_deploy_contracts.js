const Deed = artifacts.require("Deed");

module.exports = function(deployer) {
  deployer.deploy(Deed, "0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4", "0xE8C4e9611B89ffDD1734cE759692518F765Cf465", 500);
};
