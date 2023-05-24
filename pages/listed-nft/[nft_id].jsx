import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import { nftAddress } from '../../config';
import NFTOwnershipTrackingTable from '../../components/Tables/NFTOwnershipTracking';

import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import { BsListUl } from 'react-icons/bs';
import {RiShareBoxLine} from 'react-icons/ri';


export default function ListedNFT() {

    const { marketplaceContract, nftContract } = useContext(MetamaskContext);

    const [nft, setNFT] = useState({});

    const [showDescription, descriptionToggle] = useState(true);
    
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
            <div className='flex flex-col w-[75%] p-4'>
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            <div className='min-w-full white-glassmorphism my-8 border border-gray-200 rounded-xl'>
                <div className=' flex p-4 justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsListUl size={20}/>
                        <h1 className='text-lg'>Description</h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        
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
            
            <div className='w-full border border-gray-200 rounded-xl'>
                <div className='flex flex-col gap-2 p-6'>
                <span className='text-xl font-sans text-gray-600'><h1>Current price</h1></span>
                <span className='text-4xl text-black'><h1>{nft._price} MATIC</h1> </span>
                </div>
                <hr className='w-full'/>
                <div className='flex flex-row p-6 mx-auto'>
                <button
                onClick={() => unlistNFT(nft)}
                className='bg-black h-16 w-full tracking-wide rounded-lg text-white hover:bg-sky-500 hover:text-white tracking-lg'>
                    Unlist
                </button>
                </div>
            </div>
            </div>
            </div>
            <div className='flex justify-center py-2'>
                <NFTOwnershipTrackingTable id={nft.id}/>
            </div>
        </div>
        </div>
        </>
    )
}