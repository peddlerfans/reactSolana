import {
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import idl from "../../idl.json";
import * as anchor from "@project-serum/anchor";
import copy from 'copy-to-clipboard';

import { useState, useEffect } from 'react';
// import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../common/config.json"
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// import { useSearchParams } from "react-router-dom";

require("./home.css");

const GradientButton = styled(Button)({
  color: '#fff',
  padding: '12px 24px',
  borderRadius: 12,
  textTransform: 'none',
  background: 'linear-gradient(90deg,#F1912A 0%,#F1B22A 100%)',
  boxShadow: '0 6px 18px rgba(241,146,42,0.18)',
  fontWeight: 600,
});

const TodoList = () => {
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

  const getUserStateKey = async (userKey: PublicKey) => {
    const [userStateKey] = await asyncGetPda(
      [Buffer.from(TETRIS_USER_STATE_SEED), userKey.toBuffer()],
      PROGRAM_ID
    );
    return userStateKey;
  };


  const getProvider = () => {
    // console.log(wallet)
    if (!wallet) {
      return null;
    }

    const connection = new Connection(network, "processed");

    const provider = new Provider(connection, wallet, {
      preflightCommitment: "processed",
    });

    return provider;
  }

  const [arrData, setArrData] = useState([
    { value: 'TVL', num: '$0.00' },
    { value: 'Contract', num: '0 SOL' },
    { value: 'Wallet', num: '0 SOL' },
    { value: 'Your TetriSol', num: '0 TetriSol' }
  ])

  const [tetriSolNum, setTetriSol] = useState<any>('')

  const handleChange = (e: any) => {
    const value = e.target.value
    setTetriSol(value)
    // console.log(tetriSolNum)
  }

  let [referral, getReferral] = useState<any>('')

  let [rewards, setReward] = useState<any>('0.00')

  let [isStart, setStart] = useState<any>(false)


  // let referralUrl = 'https//www.tetriSol.net/home?referral=' + referral
  // https://tetrisol.net/home
  let [referralUrl, setReferralUrl] = useState<any>('https://www.tetrisol.net/home?referral=')

  let amount: any;
  let userState: any;
  let cachedPrice = 0;
  let lastFetchTime = 0;

  //获取钱包的信息 合约globalState
  const getData = async () => {
    const provider = getProvider();

    if (!provider) {
      return;
    }
    // let vaultKey = await getVaultKey();
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);

    const connection = new Connection(network, "processed");

    const currentTime = (new Date().getTime() / 1000).toFixed(0);

    const program = new Program(b, idl.metadata.address, provider);
    // if(wallet){
    //   const balance3 = await connection.getBalance(wallet.publicKey);
    //   console.log('wallet', balance3.toString());
    // }

    let globalStateKey = await getGlobalStateKey();
    let globalData = await program.account.globalState.fetch(globalStateKey);
    console.log(`globalData :`, JSON.stringify(globalData))

    //判断可以购买的时间
    if (globalData.startTime < currentTime) {
      setStart(true)
    } else {
      setStart(false)
    }

    // console.log('startTime', globalData.startTime.toString())
    const now = Date.now();
    // Vérifier si le prix est déjà en cache et si le dernier fetch est récent
    if (cachedPrice !== 0 && now - lastFetchTime < 600000) { // 10 minutes
      return Promise.resolve(cachedPrice);
    }

    const response = await axios.get('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');
    // console.log(`price :`, response.data['pairs'][0].priceUsd)
    cachedPrice = response.data['pairs'][0].priceUsd;
    // debugger
    if (wallet) {

      setReferralUrl('https://www.tetrisol.net/home?referral=' + wallet.publicKey)
      //teriSolMount
      userState = { teriSolMount: 0.00, referral: null }
      try {
        let userStateKey = await getUserStateKey(wallet.publicKey);
        userState = await program.account.userState.fetch(userStateKey);
        // console.log(`userState :`, JSON.stringify(userState))


        amount = Number(userState.settlement.toString()) / 1000000000
        amount += Number(((Number(currentTime) - Number(userState.timestamp.toString())) * globalData.totalSol * userState.teriSolMount * globalData.perReward / globalData.totalTeriSol) / 1000000000000000000)

        if (Number.isNaN(amount)) {
          amount = 0.00
        }

        // console.log('settlement', Number(userState.settlement.toString()))

        // console.log('amount', amount.toFixed(9))
        // console.log('amount差值', Number(((Number(currentTime) - Number(userState.timestamp.toString())) * globalData.totalSol * userState.teriSolMount * globalData.perReward / globalData.totalTeriSol)/1000000000000000000))
        // console.log('time差值', Number(currentTime) - userState.timestamp.toString())

        setReward(amount.toFixed(9))

        getReferral(userState.referral.toString())

        // console.log('referral', !referral)
        // console.log('referral', document.location.search)
      } catch (error) {
        // console.log(`userState error :`, error)
      }

      //TVL
      // const balance2 = await connection.getBalance(vaultKey);
      // console.log('TVL', (globalData.totalSol*cachedPrice/1000000000).toFixed(2));
      //wallet
      const balance3 = await connection.getBalance(wallet.publicKey);
      // console.log('wallet', balance3.toString());

      setArrData([
        // {value: 'TVL', num: '0.00$'},
        // {value: 'Contract', num: '0.00 SOL'},
        { value: 'TVL', num: '$' + (globalData.totalSol * cachedPrice / 1000000000).toFixed(2) },
        { value: 'Contract', num: (Number(globalData.totalSol.toString()) / 1000000000).toFixed(9) + ' SOL' },
        { value: 'Wallet', num: Number(balance3.toString()) / 1000000000 + ' SOL' },
        { value: 'Your TetriSol', num: userState.teriSolMount.toString() + ' TetriSol' },
        // {value: 'Your TetriSol', num: '0.00 TetriSol'},
      ])

      // console.log(`settlement :`, userState.settlement)
      // console.log(`当前时间 :`, currentTime)
      // console.log(`用户的时间 :`, userState.timestamp.toString())
      // console.log(`total_sol :`, globalData.totalSol)
      // console.log(`teri_sol_mount :`, userState.teriSolMount)
      // console.log(`per_reward :`, globalData.perReward)
      // console.log(`total_teri_sol :`, globalData.totalTeriSol.toString())
      // console.log('time差值', Number(currentTime) - userState.timestamp.toString())


      // let userStateKey = await getUserStateKey(wallet.publicKey);
      // let userState = await program.account.userState.fetch(userStateKey);
      // console.log(`userState :`, userState)

      // getReferral(userState.referral.toString())
      // console.log(`getReferr :`, userState.referral.toString())

      //Rewards
      // let mut amount = ctx.accounts.user_state.settlement;
      // amount += (Clock::get()?.unix_timestamp - ctx.accounts.user_state.timestamp) as u64 * ctx.accounts.global_state.total_sol * ctx.accounts.user_state.teri_sol_mount * ctx.accounts.global_state.per_reward as u64 / ctx.accounts.global_state.total_teri_sol /DECIMAL;
      //（time(当前时间 单位/秒) - user_state.timestamp) * global_state.total_sol * user_state.teri_sol_mount * global_state.per_reward / global_state.total_teri_sol /九位精度
    }

  }

  //复投
  const onHatchTetris = async () => {
    const provider = getProvider();
    // console.log('复投',provider)

    if (!provider) {
      return;
    }

    const a = JSON.stringify(idl);
    const b = JSON.parse(a);
    const program = new Program(b, idl.metadata.address, provider);

    let vaultKey = await getVaultKey();
    if (wallet) {
      //获取到的用户的钱包地址
      let key1 = wallet.publicKey
      const tx = await program.transaction.hatchTetris(
        //BN->获取到的下单的金额
        {
          accounts: {
            user: wallet.publicKey,
            globalState: await getGlobalStateKey(),
            vault: vaultKey,
            userState: await getUserStateKey(wallet.publicKey),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
          },
        });
      tx.feePayer = key1

      const connection = new Connection(network, "processed");
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signedTx = await wallet.signTransaction(tx)
      const txId = await connection.sendRawTransaction(signedTx.serialize())
      await connection.confirmTransaction(txId)

      //完成交易再次获取信息
      getData()
    }
  }

  //提现
  const onSellTetris = async () => {
    const provider = getProvider();
    // console.log('提现',provider)


    if (!provider) {
      return;
    }

    const a = JSON.stringify(idl);
    const b = JSON.parse(a);
    const program = new Program(b, idl.metadata.address, provider);

    let vaultKey = await getVaultKey();
    if (wallet) {
      //获取到的用户的钱包地址
      let key1 = wallet.publicKey
      const tx = await program.transaction.sellTetris(
        //BN->获取到的下单的金额
        {
          accounts: {
            user: key1,
            globalState: await getGlobalStateKey(),
            treasury: TREASURY,
            vault: vaultKey,
            userState: await getUserStateKey(key1),
            systemProgram: SystemProgram.programId,
          },
        });
      tx.feePayer = key1

      const connection = new Connection(network, "processed");
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signedTx = await wallet.signTransaction(tx)
      const txId = await connection.sendRawTransaction(signedTx.serialize())
      await connection.confirmTransaction(txId)

      //完成交易再次获取信息
      getData()
    }
  }


  //购买发起交易
  const onBuyTetris = async () => {
    // debugger
    if (tetriSolNum <= 0) {
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

    let vaultKey = await getVaultKey();
    // console.log('邀请人的钱包地址', referral)
    let referralKey: any;
    // //邀请人的钱包地址
    // if(referral){
    //   console.log('有邀请人')
    //   referralKey = new PublicKey(referral)
    // }else{
    //   console.log('无邀请人')
    //   referralKey = new PublicKey('11111111111111111111111111111111')
    // }

    // let referralKey = new PublicKey(referral)
    if (wallet) {
      let key1 = wallet.publicKey

      if (!referral) {
        // console.log('没有输入过推荐人')
        //没有输入过推荐人
        if (document.location.search !== '') {
          const arr = document.location.search.split('=')
          // console.log(key1.toString())
          if (arr[1] === key1.toString()) {
            // console.log('浏览器地址带有url,并且链接为自己')
            referralKey = new PublicKey('11111111111111111111111111111111')
          } else {
            // console.log('浏览器地址带有url,并且链接不为自己')
            //如果 用户信息没有推荐人并且 链接上带有推荐人参数 就修改referral
            getReferral(arr[1])
            referralKey = new PublicKey(arr[1])
            // console.log('arr', arr[1])
          }
        } else {
          // console.log('浏览器地址没有带有url')
          referralKey = new PublicKey('11111111111111111111111111111111')
        }
      } else {
        if (referral === '11111111111111111111111111111111') {
          // console.log('输入过但是为空')
          if (document.location.search !== '') {
            //如果 用户信息没有推荐人并且 链接上带有推荐人参数 就修改referral
            const arr = document.location.search.split('=')
            if (arr[1] === key1.toString()) {
              // console.log('浏览器地址带有url,但是链接为自己')
              referralKey = new PublicKey(referral)
            } else {
              // console.log('浏览器地址带有url,但是链接不为自己')
              //如果 用户信息没有推荐人并且 链接上带有推荐人参数 就修改referral
              getReferral(arr[1])
              referralKey = new PublicKey(arr[1])
              // console.log('arr', arr[1])
            }
          } else {
            // console.log('浏览器地址没有带有url')
            referralKey = new PublicKey('11111111111111111111111111111111')
          }
        } else {
          referralKey = new PublicKey(referral)
        }
      }
      // console.log('用户输入的SOL数量', tetriSolNum)
      // console.log('加精度之后的值', tetriSolNum*1000000000)
      // console.log('推荐人地址', referral)
      // console.log('推荐人地址key', referralKey.toBase58())

      //获取到的用户的钱包地址
      const tx = await program.transaction.buyTetris(
        //BN->获取到的下单的金额
        new anchor.BN(tetriSolNum * 1000000000), {
        accounts: {
          user: key1, //获取到的用户的钱包地址
          globalState: await getGlobalStateKey(),
          treasury: TREASURY,
          vault: vaultKey,
          userState: await getUserStateKey(key1),
          systemProgram: SystemProgram.programId,
          referral: referralKey, //邀请人的钱包地址
          referralState: await getUserStateKey(referralKey),
          rent: SYSVAR_RENT_PUBKEY,
        },
      });
      tx.feePayer = key1

      const connection = new Connection(network, "processed");
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signedTx = await wallet.signTransaction(tx)
      const txId = await connection.sendRawTransaction(signedTx.serialize())
      await connection.confirmTransaction(txId)

      //交易后重置输入的值
      setTetriSol('')
      //完成交易再次获取信息
      getData()
    }
  }

  const handleClick = () => {
    copy(referralUrl);
    // console.log(referralUrl)
    alert('Copied Successfully')
  }

  const targetX = () => {
    // console.log('targetX')
    window.open('https://twitter.com/TetrisSol')
  }

  const targetTg = () => {
    // console.log('targetTg')
    window.open('https://t.me/TetrisSol ')
  }

  const openPopOne = () => {
    alert('You do not have enough blocks to MINT TetrisBlOCK')
  }

  const openPopTwo = () => {
    alert('Not available at the moment')
  }

  const onTipTime = () => {
    alert(`TetriSol's launch is set for February 3rd at 1700 UTC, and you will have the opportunity to make a purchase after the launch.`)
  }

  // getData()

  // const [count,setCount] = useState(0);
  /**useEffect替代生命周期函数componentDidMount和componentDidUpdate */
  useEffect(() => {
    getData()
    setInterval(() => {
      getData()
    }, 15000)
    // console.log("componentDidMount");
  }, [wallet])


  const [choiceTetris, changeTetris] = useState<any>(0)

  const onChangeTetris = (e: any) => {
    changeTetris(e)
    // console.log(e);
  }


  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* 宣传语 */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          加入 Fiting DAO
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          一起构建去中心化的未来 — 灵活贡献、实时收益复投
        </Typography>
      </Box>

      {/* 贡献数量选择 */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={6}>
        <Button variant="outlined" sx={{ px: 4, py: 2, borderRadius: 10 }}>10 FIT</Button>
        <Button variant="outlined" sx={{ px: 4, py: 2, borderRadius: 10 }}>50 FIT</Button>
        <Button variant="outlined" sx={{ px: 4, py: 2, borderRadius: 10 }}>100 FIT</Button>
      </Stack>

      {/* 底部两按钮 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
        <GradientButton fullWidth sx={{ maxWidth: 320 }}>钱包转入</GradientButton>
        <GradientButton fullWidth sx={{ maxWidth: 320, background: 'linear-gradient(90deg,#6EE7B7 0%, #10B981 100%)' }}>
          余额复投
        </GradientButton>
      </Stack>
    </Container>
  );
}

export default TodoList;