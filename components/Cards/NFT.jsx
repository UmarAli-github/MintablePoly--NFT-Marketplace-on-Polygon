import {useRouter} from 'next/router'; 



export function FullSizeNFT(props){

    return(
        <div className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-3xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-4 mx-4 text-2xl">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-xl tracking-wider"> {props.price} MATIC</p>
                    <p className="text-white text-xl tracking-wider"> MintablePoly</p>
                    <p className="text-white text-xl"> NFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}

export function ShowcaseNFT(props){

    return(
        <div className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-3xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-4 mx-4 text-4xl">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md tracking-wider"> MintablePoly</p>
                    <p className="text-white text-md"> NFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}


export function MintedNFT(props){

    const router = useRouter();

    return(
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/minted-nft/${props.id}`)}
        >
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md"> NFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}


export function OwnedNFT(props){

    const router = useRouter();

    return(
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/owned-nft/${props.id}`)}
        >
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md"> NFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}


export function ListedNFT(props){

    const router = useRouter();

    return(
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/listed-nft/${props.id}?market=${props.market}&price=${props.price}`)}
        >
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider"> {props.name}</p>
                    <p className="text-white text-xs"> {props.price}<span className="text-white text-xs tracking-wider"> MATIC</span></p>
                </div>
            </div>
            
            </div>
        </div>
    )
}

export function BuyNFT(props){

    const router = useRouter();

    return(
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/buy-nft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}`)}
        >
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider"> {props.name}</p>
                    <p className="text-white text-xs"> {props.price}<span className="text-white text-xs tracking-wider"> MATIC</span></p>
                </div>
            </div>
            
            </div>
        </div>
    )
}

