import React, { useEffect, useState } from 'react';
import StateMachine from './contracts/StateMachine.json';
import { getWeb3 } from './utils.js';

const states = ['PENDING', 'ACTIVE', 'CLOSED'];

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [loan, setLoan] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StateMachine.networks[networkId];
      const contract = new web3.eth.Contract(
        StateMachine.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const loan = await Promise.all([
        contract.methods.amount().call(),
        contract.methods.interest().call(),
        contract.methods.end().call(),
        contract.methods.duration().call(),
        contract.methods.borrower().call(),
        contract.methods.lender().call(),
        contract.methods.state().call()
      ]);

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setLoan({
        amount: loan[0],
        interest: loan[1],
        end: loan[2],
        duration: loan[3],
        borrower: loan[4],
        lender: loan[5],
        state: parseInt(loan[6])
      });
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
      window.location.reload();
    });
  }, []);

  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof loan !== 'undefined'
    );
  }

  async function updateState() {
    const currentState =  parseInt(await contract.methods.state().call());
    setLoan({...loan, currentState});
    window.location.reload();

  }

  async function fund() {
    await contract.methods.fund().send({from: loan.lender, value: loan.amount});
    await updateState();
  };

  async function reimburse() {
    
    const newAmount = web3.utils.toBN(loan.amount);
    const newInterest = web3.utils.toBN(loan.interest);
    
    await contract.methods.reimburse().send({from: loan.borrower, value: newAmount.add(newInterest)});
    await updateState();
  };

  function isFinished() {
    const now = new Date().getTime();
    const loanEnd =  (new Date(parseInt(loan.end) * 1000)).getTime();
    return (loanEnd > now) ? false : true;
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">Loan State Machine</h1>

      <p>Borrower: {loan.borrower} </p>
      <p>Lender: {loan.lender}</p>
      <p>Amount: {web3.utils.fromWei(loan.amount, 'Ether')} Ether</p>
      <p>Interest: {web3.utils.fromWei(loan.interest, 'Ether')} Ether/month </p>
      <p>Duration: {loan.duration} Seconds</p>
      
      <p>End: {(new Date(parseInt(loan.end) * 1000)).toLocaleString()} </p>
      <p>State: {states[loan.state]}</p>
      {loan.state === 0  && accounts[0].toLowerCase() == loan.lender.toLowerCase() ? 
      //make it visible only for lender and when state is pending
      <div className="row">
        <div className="col-sm-12">
          <h2>Fund Wei</h2>
            <button 
              onClick={e => fund()}
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
        </div>
      </div>
      : null}

      {loan.state == 1  && isFinished() && accounts[0].toLowerCase() == loan.borrower.toLowerCase() ? 
      //make it visible only for borrower, when state is active, and when loan is finsihed
       <div className="row">
         <div className="col-sm-12">
            <h2>Reimburse Wei {loan.amount} + Wei {loan.interest}</h2>
             <button 
               onClick={e => reimburse()}
               type="submit" 
               className="btn btn-primary"
             >
               Submit
             </button>
         </div>
       </div>
        : null}
    </div>
  );
}

export default App;
