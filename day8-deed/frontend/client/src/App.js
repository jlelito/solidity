import React, { useEffect, useState } from 'react';
import Deed from './contracts/Deed.json';
import { getWeb3 } from './utils.js'


function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [lawyer, setLawyer] = useState(undefined);
  const [beneficiary, setBenefit] = useState(undefined);
  const [end, setEnd] = useState(undefined);
  


  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Deed.networks[networkId];
      const contract = new web3.eth.Contract(
        Deed.abi,
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
      updateBenefit();
      updateLawyer();
      updateEnd();
    }
  }, [accounts, contract, web3]);


  async function updateLawyer() {
    const lawyer = await contract.methods.lawyer().call();
    
    setLawyer(lawyer);
  }

  async function updateBenefit() {
    const beneficiary = await contract.methods.beneficiary().call();
    
    setBenefit(beneficiary);
  }

  async function updateEnd() {
    const end = await contract.methods.earliest().call();
    
    setEnd(end);
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
      <h1>Deed App</h1>
      <p>Current Account: {accounts[0]}</p>
      <p>Lawyer : {lawyer}</p>
      <p>Beneficiary: {beneficiary}</p>
      <p>Date End: {(new Date(parseInt(end)*1000)).toLocaleString()}</p>

      <form onSubmit={e => withdraw(e)}>
                      
        <button type="submit" className="btn btn-primary">
                        Withdraw
        </button>
      </form>
    </div>
  );
}

export default App;
