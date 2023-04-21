import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import SocialShare from '../../components/SocialShare';

import { MetamaskContext } from "../../context/MetamaskContext";

export default function OwnedNFTPage() {

    const { nftContract } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});
    
    const router = useRouter();

    useEffect(() => {

        loadNFT();

    }, [])    


    async function loadNFT(){

        const id = router.query.nft_id.toString()
        
        if(id <= 0) return 

        
        const tokenURI = await nftContract.tokenURI(id);

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

    

    function listNFT(nft){
        if(!nft) return

        router.push(`/list-nft?id=${nft.id}&tokenURI=${nft.tokenURI}`);

    }

    return (
        <><div className='w-full max-h-full gradient-bg-sec '>
            <div className='flex flex-col h-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col md:flex-row w-full justify-around'>
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            <div className='flex flex-col w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{nft.name}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{nft.type}</h1></span>
            <span className='text-md'>{nft.desc}</span>
            <SocialShare imageUrl={nft.image} type={721}/>
            </div>
            </div>
            <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={() => listNFT(nft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    List
                </button>
                 
            </div>
        </div>
        </div>
        </>
    )
}