import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../components/Cards/SFT';
import {DetailViewSFT } from '../components/Cards/DetailView';

import { MetamaskContext } from "../context/MetamaskContext";
import { sftAddress } from '../config';
import { ethers } from 'ethers';

export default function MintedSFT() {

    const { marketplaceContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});
    const [price, setPrice] = useState(null);

    const [value, setValue] = useState(0);
    
    const router = useRouter();

    useEffect(() => {

        loadSFT();

    }, [])    


    function valueHandler(event){

        const _value = event.target.value;

        setValue(_value);
        console.log(value);

    }


    async function loadSFT(){

        const {id, tokenURI, balance} = router.query;
        
        if(id <= 0) return 


        const metadata = await axios.get(tokenURI);

        setSFT(prev => {

            return {
                id: id,
                name: metadata.data.name,
                image: metadata.data.image,
                type: metadata.data.type,
                desc: metadata.data.description,
                tokenURI,
                balance
            }


        })

        return true;
    }

    function setPriceHandler(event){
        const _price = event.target.value;

        setPrice(_price);

    }

    async function listSFT(sft){

     try {   

        if(!sft) return; 
        if(!price) return alert("Please set a price first.");
        if(!value) return alert("Please set a value first.");


        const _id = sft.id.toString();
        const _price = price.toString();
        const _value = value.toString();

        
        const fee = await marketplaceContract.getListingFee();

        const transaction = await marketplaceContract.listSFT(sftAddress, _id, ethers.utils.parseEther(_price), _value, {value: fee});
        
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
        
      if(error.error.code === -32603){
            return alert("You've minted this token but you are no longer the owner.");
        }
  
        console.log(error);
     }

    }

    return (
        <><div className='w-full h-screen gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 justify-center items-center white-glassmorphism'>
            <div className='flex flex-col gap-24 md:flex-row md:gap-0 w-full my-auto justify-around'>
            <DetailViewSFT name={sft.name} description={sft.desc} balance={sft.balance} priceHandler={e => setPriceHandler(e)} value={value} valueHandler={e => valueHandler(e)} listSFTHandler={() => listSFT(sft)} /> 
            
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.balance}/>
            </div>
        </div>
        </div>
        </>
    )
}