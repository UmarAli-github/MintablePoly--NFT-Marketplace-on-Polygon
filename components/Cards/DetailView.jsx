import { IoIosArrowBack } from 'react-icons/io';

import Loader from '../Loader';




export function DetailViewNFT({name, description, priceHandler, listNFTHandler}){

    return (
        <>

<div className='flex justify-center relative z-0'>
              <div className='flex w-full flex-col p-12 bg-[#ffffff] rounded-2xl shadow-2xl'>
              
                <input 
                  placeholder='Title'
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  value={name}
                  disabled
                  />
      
                  <textarea 
                  placeholder='Description'
                  className='mt-4 border rounded p-4 ring-2 ring-purple-500'
                  value={description}
                  disabled
                  />
                  
                  <div className="flex flex-row gap-10">
                  <input 
                  autoFocus
                  placeholder='Price'
                  className='mt-8 border rounded p-2 w-2/3 ring-2 ring-purple-500'
                  type='number'
                  min='0.5'
                  step="0.1"
                  
                  onChange={priceHandler}
                  />
                  <input 
                  placeholder='Price'
                  className='mt-8 border rounded p-2 w-1/3 text-center ring-2 ring-purple-500'
                  value="MATIC"
                  disabled
                  />
                  </div>

                  <button 
                  onClick={listNFTHandler}
                  className="font-bold text-2xl tracking-widest mt-4 bg-black hover:bg-purple-500 hover:scale-105 text-white rounded p-4 shadow-lg"      
                  >List</button>
              </div>
            </div>

        </>
    );
}


export function ViewEditNFT({name, description, closeHandler, changeHandler, loading, editNFTHandler, nameChangeHandler, descriptionChangeHandler}){

  return (
      <>

<div className='flex justify-center relative z-0'>
              <div className={'w-[100%] mt-[5%] flex flex-col p-10 bg-[#ffffff] rounded-2xl shadow-2xl'}>
              
              <div className='flex flex-row items-center gap-10'>

              <button 
                  className="mt-4 w-12 h-12 bg-[#404040] opacity-60 hover:opacity-100 shadow rounded-full"      
                  //disabled={Tx?true:false}
                  onClick={closeHandler}
                  
                  ><IoIosArrowBack className='font-bold text-white mx-auto w-10 h-10'/></button>
              
              <p className='font-bold text-xl'>Enter NFT Details</p>      

              </div>
                
                <input 
                  placeholder='Title'
                  className='mt-8 border rounded p-4 ring-2 ring-purple-500'
                  onChange={nameChangeHandler}
                  value={name}
                  />
      
                  <textarea 
                  placeholder='Description'
                  className='mt-4 border rounded p-4 ring-2 ring-purple-500'
                  onChange={descriptionChangeHandler}
                  value={description}
                  />
      
                  <div className='relative'>
                  {loading? (<Loader/>):
                  (
                    <input 
                  type='file'
                  name='Asset'
                  className='my-4'
                  onChange={changeHandler}/>
                  )}
                  </div>
      
                  
                  <button 
                  onClick={editNFTHandler}
                  className="font-bold text-2xl tracking-widest mt-4 bg-black hover:bg-purple-500 hover:scale-105 text-white rounded p-4 shadow-lg"      
                  >Confirm</button>
              </div>
            </div>
            

      </>
  );
}