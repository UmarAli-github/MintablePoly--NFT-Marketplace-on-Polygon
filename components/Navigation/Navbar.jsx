import {useContext} from 'react';
import Link from 'next/link';
import { SiMetro } from 'react-icons/si'
import { MetamaskContext } from '../../context/MetamaskContext';

import { useRouter } from 'next/router';

import Blockie from '../Blockies';


export default function Navbar(props) {

    const router = useRouter();

    const { connectWallet, account} = useContext(MetamaskContext);

    return (
        <>
        <nav className='flex flex-row justify-between p-6 gradient-btn drop-shadow-lg'>
        <div onClick={() => router.push("/")} className='flex flex-row items-center gap-4'>
        
        <SiMetro className='w-12 h-12' style={{color:"#2c2740"}}/>
        <p className='text-xl text-[#2c2740] tracking-wider'>MintablePoly</p>  
        
        </div> 
      <div className='flex flex-row items-center justify-end gap-14'>
      
      
      {
      account? 
      (<div className='flex flex-row items-center justify-end gap-14'>
      <div className='flex w-[150px] h-[50px] bg-[#a292f5] hover:bg-[#8344e4] justify-center items-center rounded-2xl'>
        <a
          className='text-xl text-white tracking-wider'
          href={props.locate}
        >
          Create
        </a>
      </div>
      <Link href='/explore'>
        <a className='text-xl text-[#505050] tracking-wider'>Explore</a>
      </Link>
      <Link href='/user'>
      <div className='border rounded-full border-gray-800 w-[50px] h-[50px]'>
      <Blockie address={account}/>
      </div>
      </Link>
      </div>
      
      )
      :
      (
      <div className='flex w-[150px] h-[50px] bg-[#a292f5] hover:bg-[#2c2740] justify-center items-center rounded-2xl'>
        <button
        className='text-xl text-white tracking-wider'

        onClick={connectWallet}
        >
          Connect
          </button>
      </div>
      )
      }

      

      </div>
      </nav>
        </>
    );
}