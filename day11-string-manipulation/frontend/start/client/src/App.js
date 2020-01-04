import React, { useState, useEffect } from 'react';
import Strings from './contracts/Strings.json';
import { getWeb3 } from './utils.js';


function App() {
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [length, setLength] = useState(undefined);
  const [concatenation, setConcatenation] = useState(undefined);


  useEffect(() => {
    const init = async () => {
      
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Strings.networks[networkId];
      const contract = new web3.eth.Contract(Strings.abi, deployedNetwork && deployedNetwork.address);
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
      
      
    }
  }, [accounts, contract, web3]);

  async function calculateLength(e){
    e.preventDefault();
    const length = await contract.methods.length(e.target.elements[0].value).call();
    setLength(length);
  }

  async function cocatenate(e){
    e.preventDefault();
    const cocatenation = await contract.methods.concatenate(e.target.elements[0].value, e.target.elements[1].value).call()
    setConcatenation(cocatenation);
  }




  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      
      
    );
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">String manipulation</h1>
      <p>Current Account: {accounts[0]}</p>
      <div className="row">
        <div className="col-sm-12">
          <h2>Length</h2>
          <form onSubmit = {e => calculateLength(e)}>
            <div className="form-group">
              <label htmlFor="string-length">String</label>
              <input type="text" className="form-control" id="string-length" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <p>{length && `Result: ${length}`}</p>
          </form>
        </div>
      </div>

      <br />

      <div className="row">
        <div className="col-sm-12">
          <h2>Concatenate</h2>
          <form onSubmit = {e => cocatenate(e)}>
            <div className="form-group">
              <label htmlFor="string1">String 1</label>
              <input type="text" className="form-control" id="string1" />
            </div>
            <div className="form-group">
              <label htmlFor="string2">String 2</label>
              <input type="text" className="form-control" id="string2" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <p>{concatenation && `Result: ${concatenation}`}</p>
          </form>
        </div>
      </div>

    </div>
  );
}

export default App;
