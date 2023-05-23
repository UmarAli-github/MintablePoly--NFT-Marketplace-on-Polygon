import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import { nftAddress } from '../../config';
import NFTOwnershipTrackingTable from '../../components/Tables/NFTOwnershipTracking';


export default function ListedNFT() {

    const { marketplaceContract, nftContract } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});
    
    const router = useRouter();

    useEffect(() => {

        loadNFT();

    }, [])    


    async function loadNFT(){

        const {nft_id, market, price} = router.query;
        
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
                _price
                
            }


        })

        return true;
    }

    

    async function unlistNFT(nft){
        try {
            if(!nft) return

                const success = await marketplaceContract.unlistNFT(nftAddress, nft.market);

                

                const _success = await success.wait();

                if(_success) {
                    alert("Success!!");
                    return router.push("/");
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
            <div className='flex flex-col  w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{nft.name}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{nft.type}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{nft._price} MATIC</h1> </span>
            <span className='text-xl'><p>{nft.desc}</p></span>
            </div>
            </div>
            <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={() => unlistNFT(nft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Unlist
                </button>
            </div>
            <div className='flex justify-center py-2'>
                <NFTOwnershipTrackingTable id={nft.id}/>
            </div>
        </div>
        </div>
        </>
    )
}