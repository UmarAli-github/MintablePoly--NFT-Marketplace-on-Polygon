import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import SocialShare from '../../components/SocialShare';

import { MetamaskContext } from "../../context/MetamaskContext";

import SFTOwnershipTrackingTable from '../../components/Tables/SFTOwnershipTracking';

export default function OwnedSFTPage() {

    const { account, sftContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});
    
    const router = useRouter();

    useEffect(() => {

        loadSFT();

    }, [])    


    async function loadSFT(){

        const id = router.query.sft_id.toString()
        
        if(id <= 0) return 

        
        const tokenURI = await sftContract.tokenURI(id);

        const metadata = await axios.get(tokenURI);

        const balance = await sftContract.balanceOf(account, id);

        setSFT(prev => {

            return {
                id: id,
                name: metadata.data.name,
                image: metadata.data.image,
                type: metadata.data.type,
                desc: metadata.data.description,
                tokenURI,
                balance: parseInt(balance._hex, 16)
            }


        })

        return true;
    }

    

    function listSFT(sft){
        if(!sft) return

        router.push(`/list-sft?id=${sft.id}&tokenURI=${sft.tokenURI}&balance=${sft.balance}`);

    }

    return (
        <><div className='w-full max-h-full gradient-bg-sec '>
            <div className='flex flex-col h-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col md:flex-row w-full justify-around'>
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.balance}/>
            <div className='flex flex-col w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{sft.name}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{sft.type}</h1></span>
            <span className='text-md'>{sft.desc}</span>
            <SocialShare imageUrl={sft.image} type={1155}/>
            </div>
            </div>
            <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={() => listSFT(sft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    List
                </button>
                 
            </div>
        </div>

        <div className='flex justify-center py-2'>
                <SFTOwnershipTrackingTable id={sft.id}/>
        </div>
        </div>
        </>
    )
}