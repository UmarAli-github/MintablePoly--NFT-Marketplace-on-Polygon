import {ethers} from 'ethers';
import { useState,useContext, useEffect } from 'react';


import { Jazzicon } from '@ukstv/jazzicon-react';
import { SiMetro } from 'react-icons/si'
import { AiFillPlayCircle } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io'

import { 
  marketplaceaddress,
  nftAddress,
  seminftAaddress
} from '../config';

import { PROJECT_ID, API_KEY_SECRET } from '../ipfs-secret';

import { abi } from '../contracts/artifacts/contracts/Market.sol/Market.json';

import { create as ipfsClient } from 'ipfs-http-client';

import { MetamaskContext } from '../context/MetamaskContext';

import Footer from '../components/Footer';
import Receipt from '../components/Receipt';
import NFT from '../components/NFT';

const auth =
    'Basic ' + Buffer.from(PROJECT_ID + ':' + API_KEY_SECRET).toString('base64');

    const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});


export default function Home() {

  const { connectWallet, account} = useContext(MetamaskContext);

   const [fileUrl, setFileUrl] = useState(null);
   const [formType, setFormType] = useState(null);
   const [formInput, updateFormInput] = useState({name: '', description: '', type: '', supply:1 })
   const [Tx, setTx] = useState(false)
   const [receipt, setReceipt] = useState({});
   const [addr, setAddr] = useState('0x0000000000000000000000000000000000000000');

  
    async function changeHandler(e) {

      const file = e.target.files[0];
  
      try{
  
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://ipfs.io/ipfs/${added.path}`;
  
        setFileUrl(url);
      }
      catch(error){
        console.log(error);
      }
     
    }
  
    async function saveNFT(){
      // saves the NFT on ipfs
  
      let {name, description, type, supply} = formInput;
  
      if(!name || !description || !fileUrl) return alert("Please enter details !");

      type = "erc721";
      supply = 1;

      const data = JSON.stringify({
        name,description, image: fileUrl,type,supply
      });
  
      try {
  
        const added = await client.add(data);

        const url = `https://ipfs.io/ipfs/${added.path}`;
        createNFT(url);
        
      } catch (error) {
          console.log(error);
      }
    }
  
    async function createNFT(url){

      try {
        
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner()

      let contract = new ethers.Contract(marketplaceaddress, abi, signer);

      let transaction = await contract.createERC721Token(nftAddress, url);

      let tx = await transaction.wait();

      const receiptObj = {
        tx: tx.transactionHash,
        block: parseInt(tx.blockNumber),
        url: url
      }

      
      setReceipt(el =>({...receiptObj}));
      setTx(true);
        
      } catch (error) {
        
        
        if(error.code === 4001){
          return;
        }

        console.log(error);
      }
    }

    async function saveSemiNFT(){
      // saves the semi NFT on ipfs
  
      let {name, description, type, supply} = formInput;
  
      if(!name || !description || !fileUrl) return alert("Please enter details !");
    console.log(supply);
      if(supply==0) return alert("You cannot mint SFT with 0 supply");

      type = "erc1155";

      const data = JSON.stringify({
        name,description, image: fileUrl,type,supply
      });
  
      try {
  
        const added = await client.add(data);

        const url = `https://ipfs.io/ipfs/${added.path}`;
        createSemiNFT(url, supply);
        
      } catch (error) {
          console.log(error);
      }
    }
  
    async function createSemiNFT(url, supply){

      try {

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner()

      let contract = new ethers.Contract(marketplaceaddress, abi, signer);

      let transaction = await contract.createERC1155Token(seminftAaddress, url, supply);

      let tx = await transaction.wait();

      
      const receiptObj = {
        tx: tx.transactionHash,
        block: parseInt(tx.blockNumber),
        url: url
      }

      
      setReceipt(el =>({...receiptObj}));
      setTx(true);
        
      } catch (error) {
        
        if(error.code === 4001){
          return;
        }

        console.log(error);
      }
}


    function closeHandler(){

      setFileUrl(null);
      setFormType(null);
      setReceipt({});
      setTx(false);
    }

    function snipAddress(){

      
      //setAddr(account);

    }

    useEffect(() => {
      //snipAddress();
    },[])
   

  return (
    <>
     <div className="h-screen gradient-bg-main">
      <nav className='flex flex-row justify-between p-6'>
        <div className='flex flex-row items-center gap-4'>
        
        <SiMetro className='w-12 h-12' style={{color:"#2c2740"}}/>
        <p className='text-xl text-[#2c2740] tracking-wider'>MintablePoly</p>  
        
        </div> 
      <div className='flex flex-row items-center justify-end gap-14'>
      
      
      {
      account? 
      (
      <div className='flex w-[150px] h-[50px] bg-[#a292f5] hover:bg-[#8344e4] justify-center items-center rounded-2xl'>
        <a
          className='text-xl text-white tracking-wider'
          href='#mint-section'
        >
          Create
        </a>
      </div>
      )
      :
      (
      <div className='flex w-[150px] h-[50px] bg-[#a292f5] hover:bg-[#2c2740] justify-center items-center rounded-2xl'>
        <button
        className='text-xl text-white tracking-wider'

        onClick={connectWallet}
        >
          Connect
          </button>
      </div>
      )
      }

      <h1 className='text-xl text-[#505050] tracking-wider'>Explore</h1>

      <div className='w-[50px] h-[50px]'>
      <Jazzicon address={addr} />
      </div>

      </div>
      </nav>

      <div className='flex flex-row items-center'>
      

      <div className='flex flex-col'>
      <h1 className='text-6xl text-[#000] m-12 font-orbitron tracking'>
        Collect, sell, buy, <br/>discover and <br/>create your own <span className='text-gradient'>NFTs</span>
      </h1>
      <h1 className='text-sm text-[#404040] mx-12 font-sans tracking-wide'>
      <span className='font-bold'>MintablePoly</span> is a decentralized marketplace that lets you dive into the web3 world.<br/>You can mint your own NFTs, collect rare NFTs part of rare collections, not only that,<br/> You can mint entire SFT collections through MintablePoly and more....
      </h1>
      <div className='flex flex-row gap-4 w-[250px] h-[50px] bg-[#000] hover:bg-[#8344e4] mx-12 mt-12 justify-center items-center rounded'>
        <button
          className='text-xl text-white tracking-wider'
         
        >
          Create Collection
        </button>
        <AiFillPlayCircle style={{color:"white"}}/>
      </div>
      </div>

      <NFT/>
      
      </div>
      
    </div>

    {account && (
      <div id='mint-section' className="h-full gradient-bg-sec">
      <div class="flex justify-center">

          {!formType &&(
            <div className='w-1/2 flex flex-col mt-[5%] p-12 bg-[#ffffff] rounded-2xl shadow-2xl'>
            
            <h1 className='text-4xl md:text-7xl  text-[#000] m-6 font-orbitron tracking'>
            Let's<br/> Continue, <br/><span className='text-lg md:text-xl  text-[#a292f5]'>Select which token you would like to mint?</span>
          </h1>
  
              <button className='font-bold text-2xl tracking-widest mt-4 bg-[#a292f5] hover:bg-purple-400 hover:scale-105 text-white rounded p-4 shadow-lg'
                onClick={() => {
                  
                  setFileUrl(null);
                  setFormType("erc1155")}}
                >
                ERC-1155
              </button>
  
              <button className='font-bold text-2xl tracking-widest mt-4 bg-black hover:bg-purple-400 hover:scale-105 text-white rounded p-4 shadow-lg'
              
              onClick={() => {
                
                setFileUrl(null);
                setFormType("erc721")}}
              >
                ERC-721
            </button>
            </div>
          )}
  
  </div>
        {formType &&(
          <div>

            {formType && Tx &&(<Receipt receipt={receipt} modalHandler={closeHandler}/>)}
            
            {
            formType === "erc721"? 
            (
            <div className='flex justify-center relative z-0'>
              <div className={Tx?'w-1/2 mt-[5%] flex flex-col p-12 blur bg-[#ffffff] rounded-2xl shadow-2xl':'w-1/2 mt-[5%] flex flex-col p-12 bg-[#ffffff] rounded-2xl shadow-2xl'}>
              
              <div className='flex flex-row gap-24'>

              <button 
                  className="mt-4 w-12 h-12 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                  //disabled={Tx?true:false}
                  onClick={closeHandler}
                  
                  ><IoIosArrowBack className='font-bold text-white mx-auto w-10 h-10'/></button>
              
              <p className='font-bold text-4xl mt-4 '> Enter NFT Details</p>      

              </div>
                
                <input 
                  placeholder='Title'
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  onChange={e => updateFormInput({...formInput, name: e.target.value })}/>
      
                  <textarea 
                  placeholder='Description'
                  className='mt-4 border rounded p-4 ring-2 ring-purple-500'
                  onChange={e => updateFormInput({...formInput, description: e.target.value })}/>
      
                  <input 
                  type='file'
                  name='Asset'
                  disabled={Tx?true:false}
                  className='my-4'
                  onChange={changeHandler}/>
      
                  {
                    fileUrl && (
                      <img className='rounded mt-4' width="180" height="120" src={fileUrl}/>
                    )
                  }
                  
                  <button 
                  disabled={Tx?true:false}
                  onClick={saveNFT}
                  className="font-bold text-2xl tracking-widest mt-4 bg-black hover:bg-purple-500 hover:scale-105 text-white rounded p-4 shadow-lg"      
                  >Mint</button>
              </div>
            </div>
            
            ): 
            (
              <div className='flex justify-center relative z-0'>
              <div className={Tx?'w-1/2 mt-[5%] flex flex-col p-12 blur bg-[#ffffff] rounded-2xl shadow-2xl':'w-1/2 mt-[5%] flex flex-col p-12 bg-[#ffffff] rounded-2xl shadow-2xl'}>
                
              <div className='flex flex-row gap-24'>

                <button 
                    className="mt-4 w-12 h-12 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                    //disabled={Tx?true:false}
                    onClick={closeHandler}
                    
                    ><IoIosArrowBack className='font-bold text-white mx-auto w-10 h-10'/></button>

                <p className='font-bold text-4xl mt-4 '> Enter SFT Details</p>      

                </div>
                
                
                <input 
                  placeholder='Title'
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  onChange={e => updateFormInput({...formInput, name: e.target.value })}/>

                  <input 
                  placeholder='Supply'
                  type='number'
                  min="1"
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  onChange={e => updateFormInput({...formInput, supply: e.target.value })}/>
      

                  <textarea 
                  placeholder='Description'
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  onChange={e => updateFormInput({...formInput, description: e.target.value })}/>
      
                  <input 
                  type='file'
                  name='Asset'
                  className='my-4'
                  disabled={Tx?true:false}
                  onChange={changeHandler}/>
      
                  {
                    fileUrl && (
                      <img className='rounded mt-4' width="180" height="120" src={fileUrl}/>
                    )
                  }
                  
                  <button 
                  
                  onClick={saveSemiNFT}
                  disabled={Tx?true:false}
                  className="font-bold text-2xl tracking-widest mt-4 bg-black hover:bg-purple-500 hover:scale-105 text-white rounded p-4 shadow-lg"      
                  >Mint</button>
              </div>
            </div>
            )
            
            }
            
            </div>
        )
  
        }
      </div>
    )}

    <Footer account={account}/>
    </>
  )  
}
