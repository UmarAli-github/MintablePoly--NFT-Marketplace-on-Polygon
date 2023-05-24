import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import { IoIosArrowBack } from 'react-icons/io';


import { MetamaskContext } from "../../context/MetamaskContext";

import SFTOwnershipTrackingTable from '../../components/Tables/SFTOwnershipTracking';

import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import { BsListUl } from 'react-icons/bs';
import {RiShareBoxLine} from 'react-icons/ri';

export default function MintedSFT() {

    const { account, sftContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});

    const [burning, selectBurning] = useState(false);

    const [value, setValue] = useState(0);

    const [showDescription, descriptionToggle] = useState(true);
    
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

    
    async function burnSFT(value){
     
    try {
        
        const amount = value.toString();

        const id = router.query.sft_id.toString();
        
        const transaction = await sftContract.burn(id, amount);

        const _transaction = await transaction.wait();

        

        if(_transaction){
            alert("Burn Successful");
            selectBurning(false);

            setSFT(prev => {
                return {
                    ...prev,
                    balance: prev.balance - value
                }
            })
        }

        }

        catch(error) {

            if(error.code === 4001){
                return;
              }

            if(error.code === -32603){
                return alert("You've minted this token but you are no longer the owner.");
            }  

        }

    } 

    

    function editSFT(sft){
        if(!sft) return;

        router.push(`/edit-sft?id=${sft.id}&tokenURI=${sft.tokenURI}&balance=${sft.balance}`);

    }

    return (
        <><div className='w-full h-full gradient-bg-sec '>
        <div className='flex flex-col h-full w-full p-12 gap-12 white-glassmorphism'>
        <div className='flex flex-col p-4 md:flex-row w-full my-auto justify-around'>
        <div className='flex flex-col p-4 mx-14'>
        <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.balance}/>
            <div className='min-w-full white-glassmorphism my-8 border border-gray-200 rounded-xl'>
                <div className=' flex p-4 justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsListUl size={20}/>
                        <h1 className='text-lg'>Description</h1>
                    </div>
                    <div className='flex gap-4'>
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
            <div className='flex flex-col  w-full gap-14 py-14 md:py-0'>
            <div className='w-full p-6 white-glassmorphism rounded-xl border border-gray-200'>
            <h1 className='text-9xl p-4 overflow-x-auto'>{sft.name}</h1>
            <hr className='w-full' />
            <h1 className='p-4 text-4xl text-gray-600'>{sft.type}</h1>
            </div>
            <div className='w-full border border-gray-200 rounded-xl'>
                <div className='p-6'>
                {
            burning? 
            (
                <div className='flex flex-row p-4 gap-6 justify-center items-center'>
                
                <button 
                  className="w-6 h-6 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                  
                  onClick={() => selectBurning(false)}
                  
                  ><IoIosArrowBack className='font-bold text-white mx-auto w-5 h-5'/></button>

                <input 
                type='range'
                min={0}
                max={sft.balance}
                step={1}
                defaultValue={0}
                value={value}

                

                onChange={e => setValue(e.target.value)}
                
                />

                <div className='flex justify-center items-center gap-2 h-8 w-32 text-white bg-gray-500 rounded-md hover:bg-red-500'

                onClick={() => burnSFT(value)}
                
                style={{cursor:"pointer"}}
                >
                
                <div className='w-[20%]'>
                <p>{value}</p>
                </div>

                <div className='h-[80%] w-0.5 bg-white'></div>

                <p>Burn</p>
                </div>
 
                </div>

            ):
            (
                <div>
                <button
                onClick={() => selectBurning(true)}
                className='bg-black h-16 w-full tracking-wide rounded-lg text-white hover:bg-sky-500 hover:text-white'>
                    Burn
                </button>
                </div>
            )
           }
                </div>
                <hr className='w-full'/>
                <div className='flex m-6'>
                <button
                onClick={() => editSFT(sft)}
                className='bg-black h-16 w-full tracking-wide rounded-lg text-white hover:bg-sky-500 hover:text-white'>
                    Edit
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