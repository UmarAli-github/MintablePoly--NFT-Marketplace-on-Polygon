import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import { IoIosArrowBack } from 'react-icons/io';

import { sftAddress } from '../../config';
import { ethers } from 'ethers';


export default function BuySFT() {

    const { account, marketplaceContract, sftContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});

    const [buying, selectBuying] = useState(false);

    const [value, setValue] = useState(0);
    
    const router = useRouter();

    useEffect(() => {

        loadSFT();

    }, [])    


    async function loadSFT(){

        const {sft_id, market, price, seller, supply} = router.query;
        
        if(sft_id <= 0) return router.push("/");

        const _price = price.toString();
        
        const tokenURI = await sftContract.tokenURI(sft_id);

        const metadata = await axios.get(tokenURI);

        setSFT(prev => {

            return {
                id:sft_id,
                name: metadata.data.name,
                image: metadata.data.image,
                type: metadata.data.type,
                desc: metadata.data.description,
                tokenURI,
                market,
                _price,
                seller,
                supply
                
            }


        })

        return true;
    }

    

    async function buy(){

    
        if(!sft) return
        
        const seller = sft.seller;

        const _account = ethers.utils.getAddress(account);

        if(seller == _account) return alert("You are the seller, you cannot buy this token.");

        selectBuying(true);

     }


     async function buySFT(sft, value){

        
        try {
        
            if(!sft) return
            

            const total_price = String(Number(sft._price)*Number(value));


            const success = await marketplaceContract.sftSale(sftAddress, sft.market, value, {value: ethers.utils.parseEther(total_price)});
    
                    
    
                    const _success = await success.wait();
    
                    if(_success) {
                        alert("Success!!");
                        return router.push("/user");
                    }
            }
            catch(error) {
    
                if(error.code === 4001){
                    return;
                  }
    
                  console.log(error);
            }
         }

    return (
        <><div className='w-full max-h-full gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col md:flex-row w-full my-auto justify-around'>
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.supply}/>
            <div className='flex flex-col w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{sft.name}</h1></span>
            <span className='text-sm'><p>{sft.desc}</p></span>
            <span className='text-md text-gray-600'><h1>Sold by {sft.seller}</h1> </span>
            <span className='text-xl text-gray-600'><h1></h1> </span>
            <span className='text-4xl text-gray-600'><h1>{sft.type}</h1></span>
            <span className='text-4xl text-black'><h1><span className='text-4xl text-gray-600'></span>{sft._price} MATIC</h1> </span>
            
            </div>
            </div>
            <div className='flex flex-row gap-6 mx-auto'>
            {
            buying? 
            (
                <div className='flex flex-row pb-8 gap-6 justify-center items-center'>
                
                <button 
                  className="w-6 h-6 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                  
                  onClick={() => selectBuying(false)}
                  
                  ><IoIosArrowBack className='font-bold text-white mx-auto w-5 h-5'/></button>

                <input 
                type='range'
                min={0}
                max={sft.supply}
                step={1}
                defaultValue={0}
                value={value}

                

                onChange={e => setValue(e.target.value)}
                
                />

                <div className='flex justify-center items-center gap-2 h-8 w-32 text-white bg-gray-500 rounded-md hover:bg-green-500'

                onClick={() => buySFT(sft, value)}
                
                >
                
                <div className='w-[20%]'>
                <p>{value}</p>
                </div>

                <div className='h-[80%] w-0.5 bg-white'></div>

                <p>Buy</p>
                </div>
 
                </div>

            ):
            (
                <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={() => buy()}
                className='h-12 w-20 tracking-wide rounded-lg bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Buy now
                </button>
                </div>
            )
           }

        </div>
        </div>
        </div>
        </>
    )
}