import { getWallet } from "./exportWallet";
import{
    Connection,
    Transaction,
    SystemProgram,
    PublicKey
  } from '@solana/web3.js';
  import { toast } from "react-toastify";

export const connectWallet = async () =>{
    const wallet = getWallet();
    if(!wallet){
        window.open("https://phantom.app","_blank");
        return
    }
    const publicKey = await wallet.connect()
    return publicKey;
}

  