import { ethers } from 'ethers';


import {nftAddress, sftAddress, marketplaceaddress} from '../config';

import { abi as nft_abi } from '../contracts/artifacts/contracts/ERC721.sol/ERC721.json';

import { abi as sft_abi } from '../contracts/artifacts/contracts/ERC1155.sol/ERC1155.json';

import { abi as market_abi } from '../contracts/artifacts/contracts/Market.sol/Market.json';


import {createContext} from 'react';
import {useState, useEffect} from 'react';

export const MetamaskContext = createContext();

export const MetamaskProvider = ({children}) => {
    const [account, setAccount] = useState(null);
    const [marketplaceContract, setMarketplaceContract] = useState(null);
    const [nftContract, setNftContract] = useState(null);
    const [sftContract, setSftContract] = useState(null);



    let wallet;


    const connectWallet = async () => {

        try {
          wallet = window.ethereum;
    
            if(!wallet) return alert("Please install MetaMask !");
    
            const accounts = await ethereum.request({
    
                method: "eth_requestAccounts"
            });
    
    
             setAccount(accounts[0]);
    
    
             
    
            
        } catch (error) {
            
          if(error.code === 4001){
            return;
          }
            console.log(error);
            throw new Error("No ethereum object !");
        }
    };

    function setupContractsWithSigner(){

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      
      const marketcontract = new ethers.Contract(marketplaceaddress,market_abi,signer);
      setMarketplaceContract(marketcontract);
      
      const nftcontract = new ethers.Contract(nftAddress, nft_abi, signer);
      setNftContract(nftcontract);

      const sftcontract = new ethers.Contract(sftAddress,sft_abi,signer)
      setSftContract(sftcontract);

      return true;

    }
    
      const checkWalletConnection = async () => {
    
        try {
    
          if(!window.ethereum){ 
            alert("Please install MetaMask!");
            return window.location.replace("https://metamask.io/download/");
        }
        
        

        //setting metamask wallet object if it exists
          wallet = window.ethereum;
      
          
      
          if(wallet._metamask.isUnlocked()){
    
           
       //     const chainId = await wallet.request({method: 'eth_chainId'});
            
            //Mumbai test net selection
         //   if(chainId !== "0x13881"){
           //   alert("Please change network to Mumbai.");
             // addPolygon();
            //}
    
              const accounts = await wallet.request({method:"eth_accounts"});
    
              
    
                if(accounts.length) {
                    setAccount(accounts[0]);
                    
                }
                
                else{
                    console.log("No accounts found.");
                }
            
            
          }
          
        } catch (error) {
          
          if(error.code === 4001){
            return;
          }

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
        
          if(switchError.code === 4001){
            return;
          }
          
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
        
        if(addError.code === 4001){
          return;
        }

        console.log(addError);
        
          }
        
          }
        
          // handle other "switch" errors
        
        }
        }

        /*
        async function accountsChangedHandler(){
          
          try {
    
            if(!window.ethereum){ 
              alert("Please install MetaMask!");
              return window.location.replace("https://metamask.io/download/");
          }
           
      
                const accounts = await wallet.request({method:"eth_accounts"});
      
                
      
                  if(accounts.length) {
                      setAccount(accounts[0]);
                      
                  }
                  
                  else{
                      window.location.reload();
                  }
              
              
            }
            
           catch (error) {

            if(error.code === 4001){
              return;
            }
  
            console.log(error);
          }

        }
    */

    useEffect(()=>{
        setupContractsWithSigner();
        checkWalletConnection();
      },[])
    
    
      //force reload if user manually changes network chain id
      useEffect(()=>{
    
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on("chainChanged", () => window.location.reload());

      })

    return (
    <MetamaskContext.Provider value={{connectWallet,account, wallet, marketplaceContract, nftContract, sftContract}}>
    {children}
    </MetamaskContext.Provider>
    )
};