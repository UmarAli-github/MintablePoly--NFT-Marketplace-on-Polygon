import makeBlockie from "ethereum-blockies-base64";

export default function Blockie({address}){

    return <img style={{borderRadius: "100%"}} src={makeBlockie(address)}/>
     
}