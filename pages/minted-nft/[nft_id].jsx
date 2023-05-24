import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import NFTOwnershipTrackingTable from '../../components/Tables/NFTOwnershipTracking';


import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import { BsListUl } from 'react-icons/bs';
import {RiShareBoxLine} from 'react-icons/ri';

export default function MintedNFT() {

    const { nftContract, account } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});

    const [showDescription, descriptionToggle] = useState(true);
    
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

    
    async function burnNFT(){
     
    try {    
        const id = router.query.nft_id.toString();    
        
        const transaction = await nftContract.burn(id);

        const _transaction = await transaction.wait();

        

        if(_transaction){
            alert("Burn Successful");
            router.push('/user');
        }

        }

        catch(error) {

            if(error.code === 4001){
                return;
              }

            if(error.error.code === -32603){
                return alert("You've minted this token but you are no longer the owner.");
            }  
        }

    } 


    function editNFT(nft){
        if(!nft) return;

        router.push(`/edit-nft?id=${nft.id}&tokenURI=${nft.tokenURI}`);

    }

    return (
        <><div className='w-full h-full gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col p-4 md:flex-row w-full my-auto justify-around'>
            <div className='flex flex-col w-[75%] p-4'>
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            <div className='min-w-full white-glassmorphism my-8 border border-gray-200 rounded-xl'>
                <div className=' flex p-4 justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsListUl size={20}/>
                        <h1 className='text-lg'>Description</h1>
                    </div>
                    <div className='flex gap-4'>
                        <a target='_blank' href={nft.tokenURI}><RiShareBoxLine/></a> 
                    {
                        showDescription? 
                        <SlArrowUp onClick={()=>descriptionToggle(false)}/>
                        :
                        <SlArrowDown onClick={()=>descriptionToggle(true)}/>
                        
                    }
                    </div>
                </div>
                {showDescription?<hr/>:<div></div>}
                <p className={showDescription?'font-lighter text-justify font-sans p-6 overflow-y-auto h-28':'hidden'}>{nft.desc}</p>
            </div>
            </div>
            <div className='flex flex-col w-full gap-14 md:py-0'>
            <div className='w-full p-6 white-glassmorphism rounded-xl border border-gray-200'>
            <h1 className='text-9xl p-4 overflow-x-auto'>{nft.name}</h1>
            <hr className='w-full' />
            <h1 className='p-4 text-4xl text-gray-600'>{nft.type}</h1>
            </div>
            <div className='w-full m-2 border border-gray-200 rounded-xl'>
                <div className='p-6'>
                <button
                className='bg-black h-16 w-full tracking-wide rounded-lg text-white hover:bg-sky-500 hover:text-white tracking-lg'
                onClick={burnNFT}
               >
                    Burn
                </button>
                
                </div>
                <hr className='w-full'/>
            <div className='flex flex-row m-8 mx-auto'>
                <button
                onClick={() => editNFT(nft)}
                className='bg-sky-500 mx-6 h-12 w-full tracking-wide rounded-lg text-white hover:bg-white hover:text-black'>
                    Edit
                </button>
            </div>
            </div>
            </div>
            </div>
        </div>
                <div className='flex justify-center py-2'>
                <NFTOwnershipTrackingTable id={nft.id}/>
                </div>
        </div>
        </>
    )
}