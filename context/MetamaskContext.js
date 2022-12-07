import {createContext} from 'react';
import {useState, useEffect} from 'react';

export const MetamaskContext = createContext();

export const MetamaskProvider = ({children}) => {
    const [account, setAccount] = useState(null);


    let wallet;


    const connectWallet = async () => {

        try {
    
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
    

    useEffect(()=>{

        checkWalletConnection();
      },[])
    
    
      //force reload if user manually changes network chain id
      useEffect(()=>{
    
        window.ethereum.on('accountsChanged', () => accountsChangedHandler());
        window.ethereum.on("chainChanged", () => window.location.reload());

      })

    return (
    <MetamaskContext.Provider value={{connectWallet,account, wallet}}>
    {children}
    </MetamaskContext.Provider>
    )
};