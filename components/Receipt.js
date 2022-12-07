import { IoIosArrowBack } from 'react-icons/io';
import { FiCheckCircle } from 'react-icons/fi';


export default function Receipt(props){

    return(
        <div className='flex justify-center'>
            <div className='w-1/2 absolute mt-[20%] z-10 flex flex-col bg-[#fff] p-14 rounded-2xl shadow-2xl'>
                <div className="flex flex-col gap-6">
                
                    <div className='flex flex-row items-center'>
                    <button 
                    className="w-8 h-8 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                    onClick={props.modalHandler}>
                        <IoIosArrowBack className='font-bold text-white mx-auto w-6 h-6'/>
                    </button>

                    
                    <div className='flex w-full justify-center gap-4  items-center'>
                    
                    <FiCheckCircle style={{color:"rgb(134 239 172)"}} className='w-5 h-5'/>
                    <h1 className='text-4xl text-[#000] uppercase text-green-300'>Success</h1>
                    
                    </div>

                    </div>
                        <div className='flex flex-col gap-8'>
                        
                        <div className='flex flex-col gap-1'>
                        <p className=' text-purple-500 uppercase'>transaction hash: </p>
                        <div className='relative'>
                        <p className='absolute font-roboto text-gray-800 text-xs'>{props.receipt.tx}</p>
                        </div>
                        
                        </div>
                        <div className='flex flex-col gap-1'>
                        <p className=' text-purple-500 uppercase'>block number: </p>
                        <div className='relative'>
                        <p className='absolute font-roboto text-gray-800 text-xs'>{props.receipt.block}</p>
                        </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                        <p className=' text-purple-500 uppercase'>ipfs link: </p>
                        <div className='relative'>
                        <p className='absolute font-roboto text-gray-800 text-xs'>{props.receipt.url}</p>
                        </div>
                        </div>
                        
                        </div>

                        <div className='mt-[2%] flex flex-row gap-2 justify-center'>
                        
                        <button 
                            className="px-4 py-2 uppercase bg-violet-500 text-white opacity-80 hover:opacity-100 shadow-md rounded-full"      
                            
                            onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${props.receipt.tx}`, '_blank')}
                            
                        >Verify on Mumbaiscan</button>
                        
                        <button 
                            className="px-4 py-2 uppercase bg-sky-500 text-white opacity-80 hover:opacity-100  shadow-md rounded-full"      
                            
                            onClick={() => window.open(`${props.receipt.url}`, "_blank")}
                            
                        >Check metadata on IPFS</button>
                        </div>
                        
                    </div>
                </div>
        </div>);
}