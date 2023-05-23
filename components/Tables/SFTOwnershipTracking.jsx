import {useState, useEffect ,useContext} from 'react';
import { ethers } from 'ethers';

import axios from 'axios';

import {sftAddress, marketplaceaddress} from '../../config';
import {polygonscan_api_key} from '../../polyscan-secret';

import {BsBoxArrowUpRight} from 'react-icons/bs';
import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {BiTransfer} from 'react-icons/bi';


export default function SFTOwnershipTrackingTable({id}) {

    const [events, setEvents] = useState([]);

    const [showEvents, toggleShow] = useState(false);

    
    async function retrieveEvents(){

      let events_objects = [];

        const _id = parseInt(id);
      
        const _hexId = ethers.utils.hexZeroPad(ethers.utils.hexlify(_id),32);

        const sft_events = await axios.get(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock='latest'&address=${sftAddress}&topic0=0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62&topic3=${_hexId}&apikey=${polygonscan_api_key}`);

        let result = sft_events.data.result;

        let index = 0;

        for(let i=0; i<result.length; i++){

          events_objects[index] = {
            action:"Transfer",
            from: ethers.utils.hexStripZeros(result[i].topics[1]),
            to: ethers.utils.hexStripZeros(result[i].topics[2]),
            date: new Date(parseInt(sft_events.data.result[i].timeStamp, 16) * 1000).toLocaleDateString(),
            tx: result[i].transactionHash
          }

          index++;
        }

        const marketplace_events = await axios.get(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock='latest'&address=${marketplaceaddress}&topic0=0x0f0052230c02345c91649efffa357e5417db3db1611e8a6519dbd6ac7dfaf9f3&topic1=${_hexId}&apikey=${polygonscan_api_key}`);

        result = marketplace_events.data.result;

        console.log(1,result);

        for(let i=0; i<result.length; i++){

          events_objects[index] = {
            action:"Sale",
            from: ethers.utils.hexStripZeros(result[i].topics[3]),
            to: ethers.utils.hexStripZeros(result[i].topics[2]),
            date: new Date(parseInt(marketplace_events.data.result[i].timeStamp, 16) * 1000).toLocaleDateString(),
            tx: result[i].transactionHash
          }

          index++;
        }

        events_objects = events_objects.sort(
          (A,B) => Number(A.date) - Number(B.date)
        );

        setEvents(events_objects);

        console.log(events_objects);
        
        toggleShow(!showEvents);
       

    }

    
      return (
        <div className="w-[90%] m-4 white-glassmorphism">
            <div className='flex justify-between items-center' > 
             <h1 className="p-6">Item Activity</h1>
            <button className='p-6' onClick={retrieveEvents} >{showEvents?<SlArrowUp size={20}/>:<SlArrowDown size={20}/>}</button>
            </div>
            <hr className={showEvents?"":"hidden"}/>
          <div className={showEvents?'overflow-y-auto h-96':'hidden'} >
          <table className="min-w-full divide-y divide-thin divide-gray-200 rounded">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left">Event</th>
                <th className="py-3 px-6 text-left">From</th>
                <th className="py-3 px-6 text-left">To</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-6">{item.action == "Sale"?<p className='flex items-center gap-4'><AiOutlineShoppingCart size={25}/> Sale</p>:<p className='flex items-center gap-4'><BiTransfer size={25}/> Transfer</p>}</td>
                  
                  <td className="py-4 px-6 text-indigo-700 hover:underline">
                    <a target="_blank"
                     href={`https://mumbai.polygonscan.com/address/${item.from}`} 
                     rel="noopener noreferrer">{item.from.substring(0,12)+"..."}
                    </a>
                  </td>
                  
                  <td className="py-4 px-6 text-indigo-700 hover:underline"><a target="_blank"
                     href={`https://mumbai.polygonscan.com/address/${item.to}`} 
                     rel="noopener noreferrer">{item.to.substring(0,12)+"..."}
                     </a>
                  </td>
                  
                  <td className="py-4 px-6">{item.date}</td>
                  
                  <td>
                    <a target="_blank"
                     href={`https://mumbai.polygonscan.com/tx/${item.tx}`} 
                     rel="noopener noreferrer">
                    
                    <BsBoxArrowUpRight className='hover:scale-110 text-indigo-600' size={20} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      );
}