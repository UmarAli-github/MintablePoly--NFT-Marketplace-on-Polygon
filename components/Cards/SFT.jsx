import {useRouter} from 'next/router'; 



export function FullSizeSFT(props){

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
                    <p className="text-white text-xl"> SFT</p>
                </div>
            </div>
            
            </div>
        </div>
    )
}

export function ShowcaseSFT(props){

    return(
        <div className='relative'>
        <div className="h-16 w-16 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
        {props.balance}
        </div>
        <div className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-3xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-4 mx-4 text-4xl">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md tracking-wider"> MintablePoly</p>
                    <p className="text-white text-md"> SFT</p>
                </div>
            </div>
            
            </div>
        </div>
        </div>
    )
}


export function MintedSFT(props){

    const router = useRouter();

    return(
    <div className='relative'>
        <div className="h-8 w-8 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
        {props.balance}
        </div>
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/minted-sft/${props.id}`)}
        >
    
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md"> SFT</p>
                </div>
            </div>
            
            </div>
        </div>
    </div>
    )
}


export function OwnedSFT(props){

    const router = useRouter();

    return(
        <div className='relative'>
        <div className="h-8 w-8 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
        {props.balance}
        </div>
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/owned-sft/${props.id}`)}
        >
            <div className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                 style={{backgroundImage: `url(${props.uri})`}}
            >
                
            <p className="my-2 mx-2 text-md">#{props.id}</p>

            <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider"> {props.name}</p>
                    <p className="text-white text-md"> SFT</p>
                </div>
            </div>
            
            </div>
        </div>
     </div>
    )
}


export function ListedSFT(props){

    const router = useRouter();

    return(
        <div className='relative'>
        <div className="h-8 w-8 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
        {props.supply}
        </div>
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/listed-sft/${props.id}?market=${props.market}&price=${props.price}&supply=${props.supply}`)}
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
        </div>
    )
}

export function BuySFT(props){

    const router = useRouter();

    return(
        <div className='relative'>
        <div className="h-8 w-8 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
        {props.supply}
        </div>
        <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'

        onClick={() => router.push(`/buy-sft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}&supply=${props.supply}`)}
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
        </div>
    )
}

