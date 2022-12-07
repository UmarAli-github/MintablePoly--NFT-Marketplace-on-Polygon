export default function NFT(){

    return(
        <div className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div className='w-full h-full 
            bg-[url("https://ipfs.io/ipfs/QmQpxqZ6hPnx8ofapPVgbg9JAh7S9oh3fNYvWwU7okdCU8")]
            
            bg-cover flex flex-col justify-between rounded-3xl shadow-2xl'>
                
            <p className="m-4 text-2xl">#3749</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-xl"> 100 ETH</p>
                    <p className="text-white text-xl"> BAYC</p>
                    <p className="text-white text-xl"> NFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}
