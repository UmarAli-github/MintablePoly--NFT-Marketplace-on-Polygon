import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import SocialShare from '../../components/SocialShare';

import { MetamaskContext } from "../../context/MetamaskContext";

import SFTOwnershipTrackingTable from '../../components/Tables/SFTOwnershipTracking';

import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import { BsListUl } from 'react-icons/bs';
import {RiShareBoxLine} from 'react-icons/ri';

export default function OwnedSFTPage() {

    const { account, sftContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});

    const [showDescription, descriptionToggle] = useState(false);
    
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
            <div className='flex flex-col p-4 mx-14'>
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.balance}/>
            <div className='min-w-full white-glassmorphism my-8 border border-gray-200 rounded-xl'>
                <div className=' flex p-4 justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsListUl size={20}/>
                        <h1 className='text-lg'>Description</h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        <SocialShare imageUrl={sft.image} type={1155}/>
                        <a target='_blank' href={sft.tokenURI}><RiShareBoxLine/></a> 
                    {
                        showDescription? 
                        <SlArrowUp onClick={()=>descriptionToggle(false)}/>
                        :
                        <SlArrowDown onClick={()=>descriptionToggle(true)}/>
                        
                    }
                    </div>
                </div>
                {showDescription?<hr/>:<div></div>}
                <p className={showDescription?'font-lighter text-justify font-sans p-6 overflow-y-auto h-28':'hidden'}>{sft.desc}</p>
            </div>
            </div>
            <div className='flex flex-col w-full gap-14 md:py-0'>
            <div className='w-full p-6 white-glassmorphism rounded-xl border border-gray-200'>
            <h1 className='text-9xl p-4 overflow-x-auto'>{sft.name}</h1>
            <hr className='w-full' />
            <h1 className='p-4 text-4xl text-gray-600'>{sft.type}</h1>
            </div>
            <div className='w-full'>
                <div className='p-14'>
                <button
                onClick={() => listSFT(sft)}
                className='bg-black h-16 w-full tracking-wide rounded-lg text-white hover:bg-sky-500 hover:text-white tracking-lg'>
                    List
                </button>
                
                </div>
            </div>
            </div>
            </div>
        </div>

        <div className='flex justify-center py-2'>
                <SFTOwnershipTrackingTable id={sft.id}/>
        </div>
        </div>
        </>
    )
}