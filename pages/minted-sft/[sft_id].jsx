import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import { IoIosArrowBack } from 'react-icons/io';


import { MetamaskContext } from "../../context/MetamaskContext";

import SFTOwnershipTrackingTable from '../../components/Tables/SFTOwnershipTracking';

export default function MintedSFT() {

    const { account, sftContract } = useContext(MetamaskContext);

    const [sft, setSFT] = useState({});

    const [burning, selectBurning] = useState(false);

    const [value, setValue] = useState(0);
    
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

    function listSFT(sft){
        if(!sft) return;

        router.push(`/list-sft?id=${sft.id}&tokenURI=${sft.tokenURI}&balance=${sft.balance}`);

    }

    function editSFT(sft){
        if(!sft) return;

        router.push(`/edit-sft?id=${sft.id}&tokenURI=${sft.tokenURI}&balance=${sft.balance}`);

    }

    return (
        <><div className='w-full h-full gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col md:flex-row w-full my-auto justify-around'>
            <ShowcaseSFT id={sft.id} uri={sft.image} name={sft.name} balance={sft.balance}/>
            <div className='flex flex-col  w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{sft.name}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{sft.type}</h1></span>
            <span className='text-xl'><p>{sft.desc}</p></span>
            </div>
            </div>
           {
            burning? 
            (
                <div className='flex flex-row pb-8 gap-6 justify-center items-center'>
                
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
                <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={() => selectBurning(true)}
                className='h-12 w-20 tracking-wide rounded-lg bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Burn
                </button>

                <button
                onClick={() => listSFT(sft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    List
                </button>
                <button
                onClick={() => editSFT(sft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Edit
                </button>
 
                </div>
            )
           }
        </div>
        <div className='flex justify-center py-2'>
                <SFTOwnershipTrackingTable id={sft.id}/>
        </div>
        </div>
        </>
    )
}