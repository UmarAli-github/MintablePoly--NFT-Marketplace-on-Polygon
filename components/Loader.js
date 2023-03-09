import { CgSpinner } from 'react-icons/cg';

export default function Loader(){
   return(
    <CgSpinner style={{color:"purple"}} className='w-12 h-12 my-4 absolute z-10 animate-spin'/>
   ) 
}