import {ethers} from 'ethers';
import { useState,useContext, useEffect} from 'react';

import {useRouter} from 'next/router';

import axios from 'axios';

import { MetamaskContext } from '../context/MetamaskContext';

import Footer from '../components/Footer/Footer';
import Loader from '../components/Loader';

import { MintedNFT, OwnedNFT, ListedNFT } from '../components/Cards/NFT';



export default function User() {

  const {account, nftContract, sftContract, marketplaceContract} = useContext(MetamaskContext);
  
  const [loading, setLoading] = useState(false);
  

  const [showMinted, toggleMinted] = useState(true);
  const [showOwned, toggleOwned] = useState(false);
  const [showListed, toggleListed] = useState(false);


  const [mintedNfts, setMintedNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);  

  const router = useRouter();


  useEffect(() => {

    if(!account){
      router.push("/");
    }

    loadMintedNfts();
   },[])
   

 async function loadMintedNfts(){

  try {
    setLoading(true);

    
    let data = await nftContract.getMintedToken();

    const items = await Promise.all(data.map( async i => {

      const uri = await nftContract.tokenURI(i);

      const metadata = await axios.get(uri);

      console.log(metadata);
 
      
      let item = {
        id: parseInt(i._hex, 16),
        name: metadata.data.name,
        image: metadata.data.image,
        type: metadata.data.type
      }


      return item;

    }));

    
    setMintedNfts(prev => items);
    setLoading(false);


  }
  catch(e){
    setLoading(false);
    console.log(e);
  }


 }
 
 async function loadOwnedNfts(){

  try {
    setLoading(true);

    let data = await nftContract.getOwnedTokens();

    const items = await Promise.all(data.map( async i => {

      const uri = await nftContract.tokenURI(i);

      const metadata = await axios.get(uri);

      
      let item = {
        id: parseInt(i._hex, 16),
        name: metadata.data.name,
        image: metadata.data.image,
        type: metadata.data.type
      }

      return item;

    }));

    setOwnedNfts(prev => items);
    setLoading(false);



  }
  catch(e){
    setLoading(false);
    console.log(e);
  }


 } 

 async function loadListedNfts(){

  try {
    setLoading(true);

    let data = await marketplaceContract.fetchNFTsListedByUser();

    const items = await Promise.all(data.map( async i => {

      const uri = await nftContract.tokenURI(i.tokenId);


      const metadata = await axios.get(uri);

      const _price = ethers.utils.formatEther(i.price).toString().slice(0,4);

      let item = {
        id: i.tokenId.toNumber(),
        market: i.NFT_MarketItemId.toNumber(), 
        price: _price,
        name: metadata.data.name,
        image: metadata.data.image,
        type: metadata.data.type
      }

      return item;

    }));
    

    setListedNfts(prev => items);
    setLoading(false);



  }
  catch(e){
    setLoading(false);
    console.log(e);
  }


 } 


 

 
 
 useEffect(() => {

  loadOwnedNfts();
 },[showOwned])


 useEffect(() =>{

  loadListedNfts();

 }, [showListed])




  return (
    <>
     <div className="h-screen gradient-bg-sec">
        <div className='flex flex-row py-12 gap-8 w-full justify-center'>
          <div style={{cursor: "pointer"}} className={showMinted? "flex gap-2 text-white":"flex gap-2 text-black"} onClick={() => {
            toggleMinted(true)
            toggleOwned(false);
            toggleListed(false);
          }}>Minted
          <div className={showMinted?
            'w-5 h-5 rounded-full bg-white text-center text-black'
            :
            'w-5 h-5 rounded-full bg-black text-center text-white'}>
              {mintedNfts.length}
              </div>
            </div>
          
          <div style={{cursor: "pointer"}} className={showOwned? "flex gap-2 text-white":"flex gap-2 text-black"} onClick={() => {
            toggleMinted(false)
            toggleOwned(true);
            toggleListed(false);
          }}>Owned
          <div className={showOwned?
            'w-5 h-5 rounded-full bg-white text-center text-black'
            :
            'w-5 h-5 rounded-full bg-black text-center text-white'}>
              {ownedNfts.length}
              </div>
            </div>
            
          <div style={{cursor: "pointer"}}  className={showListed? "flex gap-2 text-white":"flex gap-2 text-black"} onClick={() => {
            {
              toggleMinted(false)
              toggleOwned(false);
              toggleListed(true);
            }
          }}>Listed
          <div className={showListed?
            'w-5 h-5 rounded-full bg-white text-center text-black'
            :
            'w-5 h-5 rounded-full bg-black text-center text-white'}>
              {listedNfts.length}
              </div>
            </div>
          
        </div>


        { 
        showMinted? 
        
        loading || !mintedNfts.length? 
        (<div className='flex w-full h-full items-center justify-center'>
        <Loader/> 
        </div>):
        
        (<div className="flex justify-center">
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {
                mintedNfts.map((nft, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <MintedNFT uri={nft.image} id={nft.id} name={nft.name}/>
                  </div>
                ))
              }

              
            </div>
          </div>
        </div>
        )
        : null}

      { 
        showOwned? 
        
        loading || !ownedNfts.length? 
        (<div className='flex w-full h-full items-center justify-center'>
        <Loader/> 
        </div>):
        
        (<div className="flex justify-center">
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {
                ownedNfts.map((nft, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <OwnedNFT uri={nft.image} id={nft.id} name={nft.name}/>
                  </div>
                ))
              }
              
            </div>
          </div>
        </div>
        )
        : null 
        
        }

{ 
        showListed? 
        
        loading || !listedNfts.length? 
        (<div className='flex w-full h-full items-center justify-center'>
        <Loader/> 
        </div>):
        
        (<div className="flex justify-center">
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {
                listedNfts.map((nft, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <ListedNFT uri={nft.image} id={nft.id} name={nft.name} price={nft.price} market={nft.market}/>
                  </div>
                ))
              }
             </div>
          </div>
        </div>
        )
        : null 
        
        }
        
     </div>

    <Footer account={account}/>
    </>
  )  
}