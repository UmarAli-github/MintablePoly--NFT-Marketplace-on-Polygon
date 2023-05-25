import {useRouter} from 'next/router'; 

import { useEffect, useState } from 'react';

import { FaFile } from 'react-icons/fa';


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

export function ShowcaseSFT(props) {
    const router = useRouter();
    const [mediaType, setMediaType] = useState('');
  
    useEffect(() => {
      const fetchMediaType = async () => {
        try {
          const response = await fetch(props.uri);
          const contentType = response.headers.get('content-type');
          const type = contentType.split('/')[0];
          setMediaType(type);
        } catch (error) {
          console.error('Failed to fetch media type:', error);
        }
      };
  
      fetchMediaType();
    }, [props.uri]);
  
    const renderMedia = () => {
      if (mediaType === 'image') {
        return (
          <div
            className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div
              className={`w-full h-full bg-cover flex flex-col justify-between rounded-3xl shadow-2xl`}
              style={{ backgroundImage: `url(${props.uri})` }}
            >
              <p className="my-4 mx-4 text-4xl">#{props.id}</p>
              <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                  <p className="text-white text-md tracking-wider">{props.name}</p>
                  <p className="text-white text-md">MintablePoly</p>
                  <p className="text-white text-md">x{props.balance}</p>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (mediaType === 'video') {
        return (
          <div
            className="flex mx-4 w-[350px] h-[350px] blue-shadow justify-center">
            <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden">
              <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src={props.uri} type="video/mp4" />
              </video>
              <div className="flex flex-col justify-end h-full">
                <p className="my-4 mx-4 text-4xl text-white">#{props.id}</p>
                <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider">{props.name}</p>
                    <p className="text-white text-md">MintablePoly</p>
                    <p className="text-white text-md">x{props.balance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div
            className='flex mx-4 w-[350px] h-[350px] blue-shadow justify-center'>
            <div className="w-full h-full flex flex-col justify-around items-center rounded-3xl shadow-2xl bg-gray-200">
              <p className="mx-4 text-4xl self-start">#{props.id}</p>
              <FaFile size={64} color="gray" />
              <div className="mt-6 w-full h-1/6 self-baseline blue-glassmorphism rounded-full">
                <div className="h-full flex flex-row justify-around items-center">
                  <p className="text-white text-md tracking-wider">{props.name}</p>
                  <p className="text-white text-md">MintablePoly</p>
                  <p className="text-white text-md">x{props.balance}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    };
  
    return (
      <div>
        {mediaType ? renderMedia() : null}
      </div>
    );
  }

export function MintedSFT(props) {
    const router = useRouter();
    const [mediaType, setMediaType] = useState('');
  
    useEffect(() => {
      const fetchMediaType = async () => {
        try {
          const response = await fetch(props.uri);
          const contentType = response.headers.get('content-type');
          const type = contentType.split('/')[0];
          setMediaType(type);
        } catch (error) {
          console.error('Failed to fetch media type:', error);
        }
      };
  
      fetchMediaType();
    }, [props.uri]);
  
    const renderMedia = () => {
      if (mediaType === 'image') {
        return (
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
                        <p className="text-white text-md">x{props.balance}</p>
                    </div>
                </div>
                
                </div>
            </div>
          
        );
      } else if (mediaType === 'video') {
        return (
        
          <div
            className="flex mx-auto w-[150px] h-[150px] blue-shadow justify-center"
            onClick={() => router.push(`/minted-sft/${props.id}`)}
          >
            <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden">
              <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src={props.uri} type="video/mp4" />
              </video>
              <div className="flex flex-col justify-end h-full">
                <p className="my-2 mx-2 text-md text-white">#{props.id}</p>
                <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.balance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        );
      } else {
        return (

            <div className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-around'
    
            onClick={() => router.push(`/minted-sft/${props.id}`)}
            >
                <div className="w-full h-full flex flex-col justify-center items-center rounded-xl shadow-2xl bg-gray-200">
    
            <p className="mx-2 text-md self-start">#{props.id}</p>
            <FaFile size={64} color="gray" />
            <div className="mt-6 w-full h-1/6 self-baseline blue-glassmorphism rounded-full">
              <div className="h-full flex flex-row justify-around items-center">
                <p className="text-white text-md tracking-wider">{props.name}</p>
                <p className="text-white text-md">x{props.balance}</p>
              </div>
            </div>
          </div>
            </div>
          
        );
      }
    };
  
    return (
      <div
        className="flex mx-auto w-[150px] h-[150px] blue-shadow justify-center"
        onClick={() => router.push(`/minted-sft/${props.id}`)}
      >
        {mediaType ? renderMedia() : null}
      </div>
    );
  }
  


  export function OwnedSFT(props) {
    const router = useRouter();
    const [mediaType, setMediaType] = useState('');
  
    useEffect(() => {
      const fetchMediaType = async () => {
        try {
          const response = await fetch(props.uri);
          const contentType = response.headers.get('content-type');
          const type = contentType.split('/')[0];
          setMediaType(type);
        } catch (error) {
          console.error('Failed to fetch media type:', error);
        }
      };
  
      fetchMediaType();
    }, [props.uri]);
  
    const renderMedia = () => {
      if (mediaType === 'image') {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() => router.push(`/owned-sft/${props.id}`)}
            >
              <div
                className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                style={{ backgroundImage: `url(${props.uri})` }}
              >
                <p className="my-2 mx-2 text-md">#{props.id}</p>
                <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.balance}</p>
                  </div>
                </div>
              </div>
            </div>
        );
      } else if (mediaType === 'video') {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() => router.push(`/owned-sft/${props.id}`)}
            >
              <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src={props.uri} type="video/mp4" />
                </video>
                <div className="flex flex-col justify-end h-full">
                  <p className="my-2 mx-2 text-md text-white">#{props.id}</p>
                  <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                    <div className="h-full flex flex-row justify-around items-center">
                      <p className="text-white text-md tracking-wider">{props.name}</p>
                      <p className="text-white text-md">x{props.balance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
      } else {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-around'
              onClick={() => router.push(`/owned-sft/${props.id}`)}
            >
              <div className="w-full h-full flex flex-col justify-around items-center rounded-xl shadow-2xl bg-gray-200">
                <p className="mx-2 text-md self-start">#{props.id}</p>
                <FaFile size={64} color="gray" />
                <div className="mt-6 w-full h-1/6 self-baseline blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-md tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.balance}</p>
                  </div>
                </div>
              </div>
            </div>
        );
      }
    };
  
    return (
      <div
        className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
        onClick={() => router.push(`/owned-sft/${props.id}`)}
      >
        {mediaType ? renderMedia() : null}
      </div>
    );
  }
  

  export function ListedSFT(props) {
    const router = useRouter();
    const [mediaType, setMediaType] = useState('');
  
    useEffect(() => {
      const fetchMediaType = async () => {
        try {
          const response = await fetch(props.uri);
          const contentType = response.headers.get('content-type');
          const type = contentType.split('/')[0];
          setMediaType(type);
        } catch (error) {
          console.error('Failed to fetch media type:', error);
        }
      };
  
      fetchMediaType();
    }, [props.uri]);
  
    const renderMedia = () => {
      if (mediaType === 'image') {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() =>
                router.push(
                  `/listed-sft/${props.id}?market=${props.market}&price=${props.price}&supply=${props.supply}`
                )
              }
            >
              <div
                className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                style={{ backgroundImage: `url(${props.uri})` }}
              >
                <p className="my-2 mx-2 text-md">#{props.id}</p>
                <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        );
      } else if (mediaType === 'video') {
        return (
          <div className='relative'>
            <div className="h-8 w-8 bg-yellow-500 text-white flex items-center justify-center rounded-full absolute top-0 right-0">
              {props.supply}
            </div>
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() =>
                router.push(
                  `/listed-sft/${props.id}?market=${props.market}&price=${props.price}&supply=${props.supply}`
                )
              }
            >
              <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src={props.uri} type="video/mp4" />
                </video>
                <div className="flex flex-col justify-end h-full">
                  <p className="my-2 mx-2 text-md text-white">#{props.id}</p>
                  <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                    <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-around'
              onClick={() =>
                router.push(
                  `/listed-sft/${props.id}?market=${props.market}&price=${props.price}&supply=${props.supply}`
                )
              }
            >
              <div className="w-full h-full flex flex-col justify-center items-center rounded-xl shadow-2xl bg-gray-200">
                <p className="mx-2 text-md self-start">#{props.id}</p>
                <FaFile size={64} color="gray" />
                <div className="mt-6 w-full h-1/6 self-baseline blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        );
      }
    };
  
    return (
      <div
        className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
        onClick={() =>
          router.push(`/listed-sft/${props.id}?market=${props.market}&price=${props.price}&supply=${props.supply}`)
        }
      >
        {mediaType ? renderMedia() : null}
      </div>
    );
  }
  

  export function BuySFT(props) {
    const router = useRouter();
    const [mediaType, setMediaType] = useState('');
  
    useEffect(() => {
      const fetchMediaType = async () => {
        try {
          const response = await fetch(props.uri);
          const contentType = response.headers.get('content-type');
          const type = contentType.split('/')[0];
          setMediaType(type);
        } catch (error) {
          console.error('Failed to fetch media type:', error);
        }
      };
  
      fetchMediaType();
    }, [props.uri]);
  
    const renderMedia = () => {
      if (mediaType === 'image') {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() =>
                router.push(
                  `/buy-sft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}&supply=${props.supply}`
                )
              }
            >
              <div
                className={`w-full h-full bg-cover flex flex-col justify-between rounded-xl shadow-2xl`}
                style={{ backgroundImage: `url(${props.uri})` }}
              >
                <p className="my-2 mx-2 text-md">#{props.id}</p>
                <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                  <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        );
      } else if (mediaType === 'video') {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-center'
              onClick={() =>
                router.push(
                  `/buy-sft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}&supply=${props.supply}`
                )
              }
            >
              <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src={props.uri} type="video/mp4" />
                </video>
                <div className="flex flex-col justify-end h-full">
                  <p className="my-2 mx-2 text-md text-white">#{props.id}</p>
                  <div className="my-0.5 w-full h-1/6 self-center blue-glassmorphism rounded-full">
                    <div className="h-full flex flex-row justify-around items-center">
                    <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
      } else {
        return (
            <div
              className='flex mx-auto w-[150px] h-[150px] blue-shadow justify-around'
              onClick={() =>
                router.push(
                  `/buy-sft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}&supply=${props.supply}`
                )
              }
            >
              <div className="w-full h-full flex flex-col justify-center items-center rounded-xl shadow-2xl bg-gray-200">
                <p className="mx-2 text-md self-start">#{props.id}</p>
                <FaFile size={64} color="gray" />
                <div className="mt-6 w-full h-1/6 self-baseline blue-glassmorphism rounded-full">
                  <div className="h-full flex flex-row justify-around items-center">
                  <p className="text-white text-sm tracking-wider">{props.name}</p>
                    <p className="text-white text-md">x{props.supply}</p>
                    <p className="text-white text-xs">
                      {props.price}
                      <span className="text-white text-xs tracking-wider"> MATIC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        );
      }
    };
  
    return (
      <div
        className="flex mx-auto w-[150px] h-[150px] blue-shadow justify-center"
        onClick={() =>
          router.push(
            `/buy-sft/${props.id}?market=${props.market}&price=${props.price}&seller=${props.seller}&supply=${props.supply}`
          )
        }
      >
        {mediaType ? renderMedia() : null}
      </div>
    );
  }
  