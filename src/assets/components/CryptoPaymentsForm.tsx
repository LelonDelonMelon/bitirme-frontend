import React, { useState } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export  interface  TransactionResponsePayment  extends  ethers.providers.TransactionResponse {
	network?: ethers.providers.Network,
}

const DEFAULT_ADDRESS="0x059E79d62cB9d3E8164495B56751622A42dB9fa2"

function CryptoPaymentsForm() {
  const [amount, setAmount] = useState(0); // new line
  const [destinationAddress, setDestinationAddress] = useState(DEFAULT_ADDRESS);
  const [error, setError] = useState("");
  const [transaction, setTransaction] = useState<ethers.providers.TransactionResponse | null >(null);
  const startPayment = async (event: any) => {
    console.log({ amount, destinationAddress });

    event.preventDefault();

    setError("");

    try {

      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      await window.ethereum.send("eth_requestAccounts");

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      ethers.utils.getAddress(destinationAddress);

      const transactionResponse = await signer.sendTransaction({

        to: destinationAddress,

        value: ethers.utils.parseEther(amount.toString())

      });

      console.log({ transactionResponse });
      setTransaction(transactionResponse);

    } catch (error: any) {

      console.log({ error });
      setError(error.message);

    }


  }
  return (
    <div className="n-5 p-5 card shadow text-center">

      <input type="number" placeholder="Amount" className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 
      px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        value={amount} onChange={event => { setAmount(Number.parseFloat(event.target.value)) }} />

      <input placeholder="Destination address" className="mt-5 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 
        px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        value={destinationAddress} onChange={event => { setDestinationAddress(event.target.value) }} />

      <button className="mt-5 text-white bg-gradient-to-r from-blue-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
            focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={startPayment}>

        Send Payment

      </button>

      {transaction &&

        <div className="alert alert-success mt-3" role="alert">

          {JSON.stringify(transaction)}

        </div>

      }

      {error &&

        <div className="alert alert-danger" role="alert">

          {JSON.stringify(error)}

        </div>

      }


    </div>);
}

export default CryptoPaymentsForm;

