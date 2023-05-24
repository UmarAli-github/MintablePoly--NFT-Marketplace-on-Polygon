import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import { IoIosArrowBack } from 'react-icons/io';

import { sftAddress } from '../../config';

import SFTOwnershipTrackingTable from '../../components/Tables/SFTOwnershipTracking';

import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import { BsListUl } from 'react-icons/bs';
import {RiShareBoxLine} from 'react-icons/ri';

export default function ListedSFT() {

    const { marketplaceContract, sftContract } = useContext(MetamaskContext);

    const [unlist, selectUnlist] = useState(false);

    const [value, setValue] = useState(0);

    const [sft, setSFT] = useState({});

    const [showDescription, descriptionToggle] = useState(true);
    
    const router = useRouter();

    useEffect(() => {

        loadSFT();

    }, [])    


    async function loadSFT(){

        const {sft_id, market, price, supply} = router.query;
        
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
                supply
                
            }


        })

        return true;
    }

    

    async function unlistSFT(sft, value){
        try {
            if(!sft) return

                const success = await marketplaceContract.unlistSFT(sftAddress, sft.market, value);

                

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
            <div className='flex flex-col p-4 mx-14'>
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.supply}/>
            <div className='min-w-full white-glassmorphism my-8 border border-gray-200 rounded-xl'>
                <div className=' flex p-4 justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsListUl size={20}/>
                        <h1 className='text-lg'>Description</h1>
                    </div>
                    <div className='flex items-center gap-4'>
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
            <div className='w-full border border-gray-200 rounded-xl'>
                <div className='flex flex-col gap-2 p-6'>
                <span className='text-xl font-sans text-gray-600'><h1>Current price</h1></span>
                <span className='text-4xl text-black'><h1>{sft._price} MATIC</h1> </span>
                </div>
                <hr className='w-full'/>
                {
            unlist? 
            (
                <div className='flex flex-row p-10 gap-6 justify-center items-center'>
                
                <button 
                  className="w-6 h-6 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                  
                  onClick={() => selectUnlist(false)}
                  
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

                <div className='flex justify-center items-center gap-2 h-8 w-32 text-white bg-gray-500 rounded-md hover:bg-red-500'

                style={{cursor:"pointer"}}

                onClick={() => unlistSFT(sft, value)}
                
                >
                
                <div className='w-[20%]'>
                <p>{value}</p>
                </div>

                <div className='h-[80%] w-0.5 bg-white'></div>

                <p>Unlist</p>
                </div>
 
                </div>

            ):
            (
                <div className='flex flex-row p-6 mx-auto'>
                <button
                onClick={() => selectUnlist(true)}
                className='h-16 w-full tracking-wide tracking-wide rounded-lg bg-black text-white hover:bg-sky-500 hover:text-white'>
                    Unlist
                </button>
                </div>
            )
           }
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