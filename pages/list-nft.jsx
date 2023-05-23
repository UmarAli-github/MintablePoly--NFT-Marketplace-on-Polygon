import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../components/Cards/NFT';
import {DetailViewNFT } from '../components/Cards/DetailView';

import { MetamaskContext } from "../context/MetamaskContext";
import { nftAddress, marketplaceaddress } from '../config';
import { ethers } from 'ethers';

export default function MintedNFT() {

    const { marketplaceContract } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});
    const [price, setPrice] = useState(null);
    
    const router = useRouter();

    useEffect(() => {

        loadNFT();

    }, [])    


    async function loadNFT(){

        const {id, tokenURI} = router.query;
        
        if(id <= 0) return 


        const metadata = await axios.get(tokenURI);

        setNFT(prev => {

            return {
                id: id,
                name: metadata.data.name,
                image: metadata.data.image,
                type: metadata.data.type,
                desc: metadata.data.description,
                tokenURI
            }


        })

        return true;
    }

    function setPriceHandler(event){
        const _price = event.target.value;

        setPrice(_price);

    }

    async function listNFT(nft){

     try {   

        if(!nft) return; 
        if(!price) return alert("Please set a price first.");

        const _id = nft.id.toString();
        const _price = price.toString();    
        
        const fee = await marketplaceContract.getListingFee();

        const transaction = await marketplaceContract.listNFT(nftAddress, _id, ethers.utils.parseEther(_price), {value: fee});
        
        const tx = await transaction.wait();

        
        
        if(tx){
            alert("Successful !");
            router.push("/");
        }
    }

     catch(error) {

        if(error.code === 4001){
            return;
        }
     if(error){
           return alert(error.message);
      }
        
     }

    }

    return (
        <><div className='w-full h-screen gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 justify-center items-center white-glassmorphism'>
            <div className='flex flex-col gap-24 md:flex-row md:gap-0 w-full my-auto justify-around'>
            <DetailViewNFT name={nft.name} description={nft.desc} priceHandler={e => setPriceHandler(e)} listNFTHandler={() => listNFT(nft)} /> 
            
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            </div>
        </div>
        </div>
        </>
    )
}