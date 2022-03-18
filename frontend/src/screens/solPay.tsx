import {  Connection, Keypair, PublicKey, LAMPORTS_PER_SOL  } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { getWallet } from "./exportWallet";
import React, {createRef,  useRef, useCallback, useState, useEffect } from "react";
import { Modal } from "@mui/material"
import { toast } from "react-toastify";
import {
    encodeURL,
    createQR,
    findTransactionSignature,
    FindTransactionSignatureError,
    validateTransactionSignature,
  } from "@solana/pay";
import axios from 'axios';

  interface Props {
    open: boolean;
    closeModal: () => void;
    cost: number;
    orderId: string;
  }


const SolPay = async ({ open, closeModal, cost, orderId } : Props) => {

    
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
	
        const amountTemp = Number(cost / solPrice).toFixed(2);
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


    const qrRef = createRef<HTMLDivElement>();
    const wallet = getWallet()
    const environ = "devnet"
    const network = `https://api.${environ}.solana.com`
    const connection = new Connection(network)
    const MERCHANT_WALLET = new PublicKey(
      "EnYqiB4AsV9dcihwCdcPrnE6fXZLNxYxfrzVG4CT2vR8"
    );
  
    const makeUrl = useCallback(async () => {
      const label = "Downtown";
      const message = `Downtown Bill ${orderId}`;
      const amount = new BigNumber(solTotal);
      const reference = new Keypair().publicKey;
      let paymentStatus: string;
      try {
          console.log("3. 💰 Create a payment request link \n");
          const url = encodeURL({
            recipient: MERCHANT_WALLET,
            amount,
            reference,
            label,
            message,
          });
          const qrCode = createQR(url);
          qrCode.append(qrRef.current);
          console.log(url);
          paymentStatus = 'pending';
          console.log(`payment status: ${paymentStatus}`);
          let signatureInfo;
          const { signature } = await new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                console.count('Checking for transaction...');
                try {
                    signatureInfo = await findTransactionSignature(connection, reference, undefined, 'confirmed');
                    console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                    clearInterval(interval);
                    resolve(signatureInfo);
                } catch (error: any) {
                    if (!(error instanceof FindTransactionSignatureError)) {
                        console.error(error);
                        clearInterval(interval);
                        reject(error);
                    }
                }
            }, 250);
        });
  
        paymentStatus = "confirmed";
        console.log(`payment status: ${paymentStatus}`);
        try {
          const amountInLamports = amount.times(LAMPORTS_PER_SOL).integerValue(BigNumber.ROUND_FLOOR);
    
          await validateTransactionSignature(
              connection,
              signature,
              MERCHANT_WALLET,
              amountInLamports,
              undefined,
              reference
          );
    
          // Update payment status
          paymentStatus = 'validated';
          console.log('✅ Payment validated');
          console.log('📦 Ship order to customer');
      } catch (error) {
          console.error('❌ Payment failed', error);
      }
    
      }catch(err) {
       console.log(err)   
      }
  
  
  
    }, []);
  
    
  
    return (
        <Modal
        open={open}
        onClose={closeModal}
        className="flex items-center justify-center outline-none ring-0"
      >
        <div className="p-2 bg-white rounded-md aspect-square">
          <div 
            ref={qrRef}
          ></div>
          <div className="flex flex-col items-center justify-center">
            <p className="mt-4 font-bold text-center">
              Scan this code with your Solana Pay wallet
            </p>
            <p>You will be asked to approve the transaction</p>
          </div>
        </div>
      </Modal>
    );
  };

  export default SolPay;