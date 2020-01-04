import React, { useEffect, useState } from 'react';
import { getWeb3 } from './utils.js';
import Escrow from './contracts/Escrow.json';

function App() {
  
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [payer, setPayer] = useState(undefined);
  const [payee, setPayee] = useState(undefined);
  const [lawyer, setLawyer] = useState(undefined);
  const [amount, setAmount] = useState(undefined);




  useEffect(() => {
    const init = async () => {

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Escrow.networks[networkId];
      const contract = new web3.eth.Contract(
        Escrow.abi,
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
    const balance = await contract.methods.balanceOf().call();
    const payer = await contract.methods.payer().call();
    const payee = await contract.methods.payee().call();
    const lawyer = await contract.methods.lawyer().call();
    const amount = await contract.methods.amount().call();
    setBalance(balance);
    setPayer(payer);
    setPayee(payee);
    setLawyer(lawyer);
    setAmount(amount);
  }

  async function deposit(e){
    e.preventDefault();
    const value = e.target.elements[0].value;
    await contract.methods.deposit().send({from: accounts[0], value: value});
    updateContract();
  }

  async function release(e){
    e.preventDefault();
    await contract.methods.release().send({from: accounts[0]});
    updateContract();
    
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
      <div className="container">
        <h1 className="text-center">Escrow</h1>
        <h1>Current Account: {accounts[0]}</h1>
        <p>Lawyer: {lawyer}</p>
        <p>Payer: {payer}</p>
        <p>Payee: {payee}</p>
        

        <div className="row">
          <div className="col-sm-12">
            <p>Amount to be Sent to Escrow: {amount} Wei</p>
            <p>Current Contract Balance: <b>{balance}</b> wei </p>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <form onSubmit = {e => deposit(e)}>
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <input type="number" className="form-control" id="deposit" />
              </div>
              <button type="submit" className="btn btn-primary">Deposit</button>
            </form>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-sm-12">
             <button onClick={e => release(e)} type="submit" className="btn btn-primary">Release</button>
          </div>
        </div>

      </div>
    );
  
}

export default App;
