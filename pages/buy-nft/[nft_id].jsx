import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import { nftAddress } from '../../config';
import { ethers } from 'ethers';


export default function BuyNFT() {

    const { account, marketplaceContract, nftContract } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});
    
    const router = useRouter();

    useEffect(() => {

        loadNFT();

    }, [])    


    async function loadNFT(){

        const {nft_id, market, price, seller} = router.query;
        
        if(nft_id <= 0) return router.push("/");

        const _price = price.toString();
        
        const tokenURI = await nftContract.tokenURI(nft_id);

        const metadata = await axios.get(tokenURI);

        setNFT(prev => {

            return {
                id:nft_id,
                name: metadata.data.name,
                image: metadata.data.image,
                type: metadata.data.type,
                desc: metadata.data.description,
                tokenURI,
                market,
                _price,
                seller
                
            }


        })

        return true;
    }

    

    async function buyNFT(nft){

    try {
    
        if(!nft) return
        
        const seller = nft.seller;

        const _account = ethers.utils.getAddress(account);

        if(seller == _account) return alert("You are the seller, you cannot buy this token.");

        const success = await marketplaceContract.nftSale(nftAddress, nft.market, {value: ethers.utils.parseEther(nft._price)});

                

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
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            <div className='flex flex-col w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{nft.name}</h1></span>
            <span className='text-sm'><p>{nft.desc}</p></span>
            <span className='text-md text-gray-600'><h1>Sold by {nft.seller}</h1> </span>
            <span className='text-xl text-gray-600'><h1></h1> </span>
            <span className='text-4xl text-gray-600'><h1>{nft.type}</h1></span>
            <span className='text-4xl text-black'><h1><span className='text-4xl text-gray-600'></span>{nft._price} MATIC</h1> </span>
            
            </div>
            </div>
            <div className='flex flex-row gap-6 mx-auto'>
                <button
                onClick={() => buyNFT(nft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Buy
                </button>
            </div>
        </div>
        </div>
        </>
    )
}