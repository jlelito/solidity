import React, { useEffect, useState } from 'react';
import DeedMultiPayouts from './contracts/DeedMultiPayouts.json';
import { getWeb3 } from './utils.js'


function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [lawyer, setLawyer] = useState(undefined);
  const [beneficiary, setBenefit] = useState(undefined);
  const [end, setEnd] = useState(undefined);
  const [payouts, setPay] = useState(undefined);
  const [amount, setAmount] = useState(undefined);
  const [interval, setInterval] = useState(undefined);
  const [paidPayouts, setPaidPayouts] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  


  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DeedMultiPayouts.networks[networkId];
      const contract = new web3.eth.Contract(
        DeedMultiPayouts.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      
      
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  useEffect (() => {
    if(isReady()){
      updateContract();
    }
  }, [accounts, contract, web3]);

  async function updateContract() {
    const lawyer = await contract.methods.lawyer().call();
    const beneficiary = await contract.methods.beneficiary().call();
    const end = await contract.methods.earliest().call();
    const payouts = await contract.methods.PAYOUTS().call();
    const amount = await contract.methods.amount().call();
    const interval = await contract.methods.INTERVAL().call();
    const paidPayouts = await contract.methods.paidPayouts().call();
    const balance = await contract.methods.balanceOf().call();
    
    setLawyer(lawyer);
    setBenefit(beneficiary);
    setEnd(end);
    setPay(payouts);
    setAmount(amount);
    setInterval(interval);
    setPaidPayouts(paidPayouts);
    setBalance(balance);
  }


  async function withdraw(e) {
    e.preventDefault();
    await contract.methods.withdraw().send({from: accounts[0]});
  }

  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      
    );
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>DeedMultiPayouts App</h1>
      <p>Current Account: {accounts[0]}</p>
      <p>Total Amount to be Paid Out: {amount} Wei</p>
      <p>Total Left inside the Deed: {balance} Wei</p>
      <p>Lawyer : {lawyer}</p>
      <p>Beneficiary: {beneficiary}</p>
      <p>Date End: {(new Date(parseInt(end)*1000)).toLocaleString()}</p>
      <p>Total number of payouts: {payouts}</p>
      <p>Intervals: {interval}</p>
      <p>Number of Paid Payouts: {paidPayouts}</p>

      <form onSubmit={e => withdraw(e)}>       
        <button type="submit" className="btn btn-primary">
            Withdraw
        </button>
      </form>
    </div>
  );
}

export default App;
