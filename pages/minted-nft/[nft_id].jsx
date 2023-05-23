import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';

import { ShowcaseNFT } from '../../components/Cards/NFT';

import { MetamaskContext } from "../../context/MetamaskContext";

import NFTOwnershipTrackingTable from '../../components/Tables/NFTOwnershipTracking';

export default function MintedNFT() {

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

    function listNFT(nft){
        if(!nft) return;

        router.push(`/list-nft?id=${nft.id}&tokenURI=${nft.tokenURI}`);

    }

    function editNFT(nft){
        if(!nft) return;

        router.push(`/edit-nft?id=${nft.id}&tokenURI=${nft.tokenURI}`);

    }

    return (
        <><div className='w-full h-full gradient-bg-sec '>
            <div className='flex flex-col h-full w-full p-12 gap-12 white-glassmorphism'>
            <div className='flex flex-col md:flex-row w-full my-auto justify-around'>
            <ShowcaseNFT id={nft.id} uri={nft.image} name={nft.name} />
            <div className='flex flex-col  w-[50%] gap-6 py-12 md:py-0'>
            <span className='text-9xl'><h1>{nft.name}</h1></span>
            <span className='text-4xl text-gray-600'><h1>{nft.type}</h1></span>
            <span className='text-xl'><p>{nft.desc}</p></span>
            </div>
            </div>
            <div className='flex flex-row pb-4 gap-6 mx-auto'>
                <button
                onClick={burnNFT}
                className='h-12 w-20 tracking-wide rounded-lg bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Burn
                </button>

                <button
                onClick={() => listNFT(nft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    List
                </button>
                <button
                onClick={() => editNFT(nft)}
                className='bg-black h-12 w-20 tracking-wide rounded-lg text-white hover:bg-white hover:text-black hover:border-2 hover:border-black'>
                    Edit
                </button>
            </div>
        </div>
                <div className='flex justify-center py-2'>
                <NFTOwnershipTrackingTable id={nft.id}/>
                </div>
        </div>
        </>
    )
}