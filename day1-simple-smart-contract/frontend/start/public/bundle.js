var contractABI = [];
var contractAddress = '0xE675644F147b69A151f62E01578429bf06c67820';

var web3 = new Web3('http://localhost:9545');
var simpleSmartContract = new web3.eth.Contract(contractABI, contractAddress);

console.log(simpleSmartContract);
web3.eth.getAccounts()
.then(console.log);