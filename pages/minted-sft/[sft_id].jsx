import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseSFT } from '../../components/Cards/SFT';

import { MetamaskContext } from "../../context/MetamaskContext";

export default function MintedSFT() {

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

    
    async function burnSFT(){
     
    try {    
        const id = router.query.sft_id.toString();
        
        const transaction = await sftContract.burn(id);

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

    function listSFT(sft){
        if(!sft) return;

        router.push(`/list-sft?id=${sft.id}&tokenURI=${sft.tokenURI}`);

    }

    function editSFT(sft){
        if(!sft) return;

        router.push(`/edit-sft?id=${sft.id}&tokenURI=${sft.tokenURI}`);

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
            <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={burnSFT}
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
        </div>
        </div>
        </>
    )
}