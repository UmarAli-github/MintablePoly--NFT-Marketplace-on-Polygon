import {ethers} from 'ethers';
import { useEffect, useState } from 'react';

import { 
  marketplaceaddress,
  erc721contractaddress,
  erc1155contractaddress
} from '../config';

import { abi } from '../contracts/artifacts/contracts/Market.sol/Market.json'

//handle 4901

export default function Home() {
   const [account, setAccount] = useState(null);


  //wallet represents metamask wallet object in window of client
  let wallet;

  const connectWallet = async () => {

    try {

        if(!wallet) return alert("Please install MetaMask !");

        const accounts = await ethereum.request({

            method: "eth_requestAccounts"
        });


         setAccount(accounts[0]);


         window.location.reload();

        
    } catch (error) {
        
        console.log(error);
        throw new Error("No ethereum object !");
    }
};

  const checkWalletConnection = async () => {

    try {

      if(!window.ethereum){ 
        alert("Please install MetaMask!");
        return window.location.replace("https://metamask.io/download/");
    }
  
    //setting metamask wallet object if it exists
      wallet = window.ethereum;
  
      
  
      if(wallet._metamask.isUnlocked()){

        
        const chainId = await wallet.request({method: 'eth_chainId'});
        
        //Mumbai test net selection
        if(chainId !== "0x13881"){
          alert("Please change network to Mumbai.");
          addPolygon();
        }

          const accounts = await wallet.request({method:"eth_accounts"});

          console.log(accounts[0]);

            if(accounts.length) {
                setAccount(accounts[0]);
                
            }
            
            else{
                console.log("No accounts found.");
            }
        
        
      }
      
    } catch (error) {
      console.log(error);
    }
  }


  async function addPolygon(){

    try {
    
      await ethereum.request({
    
      method: "wallet_switchEthereumChain",
    
      params: [{ chainId: "0x13881" }],
    
      });
    
    } catch (switchError) {
    
      // This error code indicates that the chain has not been added to MetaMask.
    
      if (switchError.code === 4902) {
    
      try {
    await ethereum.request({
    
        method: "wallet_addEthereumChain",
    
        params: [
    {
    
    chainId: "0x13881",
    
    chainName: "Mumbai Testnet",
    
    rpcUrls: ["https://rpc-mumbai.matic.today"],
    
    nativeCurrency: {
    
    name: "Matic",
    
    symbol: "Matic",
    
    decimals: 18,
    
    },
    
    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
    
    },
    
    ],
    
    });
    
      } catch (addError) {
    // handle "add" error
    
    console.log(addError);
    
      }
    
      }
    
      // handle other "switch" errors
    
    }
    }



  useEffect(()=>{

    checkWalletConnection();
  },[])


  //force reload if user manually changes network chain id
  useEffect(()=>{

    window.ethereum.on("chainChanged", () => window.location.reload());
  })

  return (
    <>
    <div className="w-screen h-screen bg-red-200">
      <nav className='border-b p-6'>
      <p className='text-4xl font-mono font-bold'>MintablePOLY Marketplace</p>
      </nav>
      <div className='flex justify-center mt-24'>
      {
      account? 
      (
      <div className='px-12 py-8 bg-white rounded-xl'>
        <a
          className='text-2xl text-red-600 font-bold'
          href='#mint-section'
        >
          Mint Token
        </a>
      </div>
      )
      :
      (
      <div className='px-12 py-8 bg-white rounded-xl'>
        <button
        className='text-xl text-red-600 font-bold'

        onClick={connectWallet}
        >
          Connect Wallet
          </button>
      </div>
      )
      }
      </div>
    </div>

    <div id='mint-section' className="w-screen h-screen bg-red-500">

    </div>
    </>
  )  
}
