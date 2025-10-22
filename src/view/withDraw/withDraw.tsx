import {
    useAnchorWallet,
  } from "@solana/wallet-adapter-react";
import { Connection , PublicKey , SystemProgram} from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import idl from "../../idl.json";
import * as anchor from "@project-serum/anchor";
// import common from "../../common/common"
import config from "../../common/config.json"

import { useState } from 'react';
  // import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
  // import { useSearchParams } from "react-router-dom";
  
  require("./withDraw.css");

const WidthDraw = () => {
    const TETRIS_STATE_SEED = config.TETRIS_STATE_SEED;
    const TETRIS_VAULT_SEED = config.TETRIS_VAULT_SEED;
    const TETRIS_USER_STATE_SEED = config.TETRIS_USER_STATE_SEED;
    const network = config.network;

    let wallet = useAnchorWallet();

    const PROGRAM_ID = new PublicKey(config.PROGRAM_ID);
    const TREASURY = new PublicKey(config.TREASURY);

    const getGlobalStateKey = async () => {
        const [globalStateKey] = await asyncGetPda(
            [Buffer.from(TETRIS_STATE_SEED)],
            PROGRAM_ID
        );
        return globalStateKey;
    };

    const getUserStateKey = async (userKey: PublicKey) => {
        const [userStateKey] = await asyncGetPda(
            [Buffer.from(TETRIS_USER_STATE_SEED), userKey.toBuffer()],
            PROGRAM_ID
        );
        return userStateKey;
    };

    const asyncGetPda = async (
        seeds: Buffer[],
        programId: PublicKey
        ): Promise<[PublicKey, number]> => {
        const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
        return [pubKey, bump];
    };
        
    const getVaultKey = async () => {
        const [vaultKey] = await asyncGetPda(
            [Buffer.from(TETRIS_VAULT_SEED)],
            PROGRAM_ID
        );
        // console.log(vaultKey.toBase58())
        return vaultKey;
    };

    const getProvider = () => {
        if (!wallet) {
            return null;
        }

        const connection = new Connection(network, "processed");

        const provider = new Provider(connection, wallet, {
            preflightCommitment: "processed",
        });

        return provider;
    }


    const [tetriSolNum, setTetriSol] = useState<any>('')
    const [address, setAddress] = useState<any>('')

    //提现
    const onWithDraw = async () => {
        debugger
        if(tetriSolNum === '' || address === ''){
            alert('not empty')
            return false
        }
        if(tetriSolNum <= 0){
            alert('Purchase amount cannot be less than or equals to 0')
            return false
        }
        
        const provider = getProvider();
        // console.log('提现',provider)


        if (!provider) {
            return;
        }
       
        const a = JSON.stringify(idl);
        const b = JSON.parse(a);
        const program = new Program(b, idl.metadata.address, provider);
        let user = new PublicKey(address);
        

        if(wallet) {

            //获取到的用户的钱包地址
            let key1 = wallet.publicKey
            const tx = await program.transaction.withdraw(
                //BN->获取到的下单的金额
                new anchor.BN(tetriSolNum*1000000000),
                // new anchor.BN(100000000),
                {
                    accounts: {
                        authority: wallet.publicKey,
                        globalState: await getGlobalStateKey(),
                        systemProgram: SystemProgram.programId,
                        user: user,
                        treasury: TREASURY,
                        vault: await getVaultKey(),
                    },
                });
            tx.feePayer = key1

            const connection = new Connection(network, "processed");
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            const signedTx = await wallet.signTransaction(tx)
            const txId = await connection.sendRawTransaction(signedTx.serialize())
            await connection.confirmTransaction(txId)
            // setAddress('')
            // setTetriSol('')
        }
    }

    //改变用户的tetrisol
    const onChangeTetris = async () => {
        if(tetriSolNum === '' || address === ''){
            alert('not empty')
            return false
        }
        if(tetriSolNum <= 0){
            alert('Purchase amount cannot be less than or equals to 0')
            return false
        }
        
        const provider = getProvider();


        if (!provider) {
            return;
        }
        const a = JSON.stringify(idl);
        const b = JSON.parse(a);
        const program = new Program(b, idl.metadata.address, provider);
        let userKey = new PublicKey(address);
        let userStateKey = await getUserStateKey(userKey);
        if(wallet) {
        //获取到的用户的钱包地址
        let key1 = wallet.publicKey
        const tx = await program.transaction.setUser(
            //BN->获取到的下单的金额
            new anchor.BN(tetriSolNum),
            {
                accounts: {
                    authority: wallet.publicKey,
                    globalState: await getGlobalStateKey(),
                    userState: userStateKey,
                    systemProgram: SystemProgram.programId,
                },
            });
        tx.feePayer = key1

        const connection = new Connection(network, "processed");
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
        const signedTx = await wallet.signTransaction(tx)
        const txId = await connection.sendRawTransaction(signedTx.serialize())
        await connection.confirmTransaction(txId)
        // setAddress('')
        // setTetriSol('')
        }
    }
    
    const handleChange = (e: any) => {
        const value = e.target.value
        setTetriSol(value)
        console.log(tetriSolNum)
    }

    const handleChangeAddress = (e: any) => {
        const value = e.target.value
        setAddress(value)
        console.log(address)
    }
  
    return (
      <div className="content withdraw_box">
            <div className="withdraw_inp">
                <input type="number" placeholder="home" onChange={handleChange} onWheel={event => (event.target as HTMLInputElement).blur()} value={tetriSolNum}/>
           
                <input type="text" placeholder="city" onChange={handleChangeAddress} onWheel={event => (event.target as HTMLInputElement).blur()} value={address}/>
            </div>

            <div className="buy_btn flex just_align_center" onClick={onWithDraw}>
                1
            </div>

            <div className="buy_btn flex just_align_center" style={{backgroundColor: '#7A53FF'}} onClick={onChangeTetris}>
                2
            </div>
      </div>
    );
}
  
export default WidthDraw;