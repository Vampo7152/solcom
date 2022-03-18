import { Connection, Transaction,SystemProgram } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {PublicKey} from '@solana/web3.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWallet } from "./exportWallet";

interface userData{
    amount:number;

}


const SolCheckout = (props:userData) =>{


    const [amount, setAmount] = useState(0);
    const [amountAfterTXN,setamountAfterTXN] = useState(0)
    
    const [walletAddress,setWalletAddress] = useState("");
    const [currentWalletBalance,setcurrentWalletBalance] = useState('');


    const [solPrice,setSolPrice] = useState(0);
	const [solTotal,setSolTotal] = useState(0);

	const fetchSolPrice = async() => {
		try {
		  const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
		  setSolPrice(data.solana.usd);
		} catch (error) {
		  console.error('Unable to fetch SOL price.');
		}
	  }
	
	const computeSolPrice = () => {
			const amountTemp = Number(amount / solPrice).toFixed(2);
            const realamt = parseFloat(amountTemp)
            console.log(realamt);
			setSolTotal(realamt);
	  }


	useEffect(()=>{
		fetchSolPrice();	
	},[])

	useEffect(()=>{
		computeSolPrice();
	},[solPrice])

    useEffect(()=>{
        console.log("SOL TOTAL : s" , solTotal)
    },[solTotal])




    useEffect(()=>{
        console.log(amount);
    },[amount])



    const IfWalletConnected = async () =>{
        try{
            const {solana} = window;
            if(solana){
                if(solana.isPhantom){
                    console.log("Phantom Wallet Found!")
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log(
                      'Connected with Public Key:',
                      response.publicKey.toString()
                    );
                    setWalletAddress(response.publicKey.toString());
                }else{
                    alert("Solana Object Not Found")
                }
            }
        }catch(error){
         console.error(error);
        }
    }
    
    const connectWallet = async () =>{
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
         
        }
    };


    //API
       const paySolana  = async () =>{
        const wallet = getWallet()
        const sender = connectWallet()
        const environ = "devnet"
        const network = `https://api.${environ}.solana.com`
        const bizOwnerAddress = "EWfVcG1SHjrHNiYaDdhpNepkS8xhZJ2Uwwd9h56ZpnLd";
        console.log(amount);
    
        const connection = new Connection(network)
        const transaction = new Transaction()
        .add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(walletAddress),
            toPubkey:new PublicKey(bizOwnerAddress),
            lamports: solTotal * 1000000000
          })
        );
    
        const { blockhash } = await connection.getRecentBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = new PublicKey(walletAddress)
        
       if(transaction){
         try{
    
          let signed = await wallet.signTransaction(transaction)
          console.log('Got signature, submitting transaction');
      
          let signature = await connection.sendRawTransaction(signed.serialize());
            console.log('Submitted transaction ' + signature + ', awaiting confirmation');
      
            await connection.confirmTransaction(signature);
            console.log('Transaction ' + signature + ' confirmed');
    
            console.log(`https://solscan.io/tx/${signature}?cluster=devnet`);
    
         } catch(e){
          console.warn(e);
          console.log((e));
          toast.error(
            "Transaction not completed! 😢"
          );
         }
       }return {
        error: "No transaction found"
     }
    }



  /* const paySolana = async() =>{
        toast("Wow so easy!");
        const sender = new PublicKey(walletAddress);
        const orignalBal:number = +currentWalletBalance;
        console.log("IN PAY SOLANA: ", amount );
        // Beneficiary wallet address below
        const bizOwnerAddress = "EWfVcG1SHjrHNiYaDdhpNepkS8xhZJ2Uwwd9h56ZpnLd";
        const receiver = new PublicKey(bizOwnerAddress);
        const signature = await sendMoney(sender,receiver,solTotal);
        console.log(`https://solscan.io/tx/${signature}?cluster=devnet`);
    }
*/
    //UseEffects

    useEffect(()=>{
    IfWalletConnected();   
    setAmount(props.amount);

    },[])
    
    
    
    return(
        <div>        
        {!walletAddress && IfWalletConnected ? 
        
        <Button
        onClick={connectWallet}
        color="primary"
        >Connect Phantom Wallet</Button>
        
        :
        <div>
        <Button color="primary"
        
        
        onClick={paySolana}
        
        
        >Pay {solTotal} With Solana</Button>
        <br/>
         </div>
        }
    
        </div>

    )

}

export default SolCheckout;