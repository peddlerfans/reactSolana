import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useTranslation } from 'react-i18next';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import idl from "../../idl.json";
import { apiService } from "../../utils/apiService";
import * as anchor from "@project-serum/anchor";
import { transferAndSplit } from '../../utils/contract';
import { useState, useEffect } from 'react';
// import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import axios from "axios";
import config from "../../common/config.json"
import PasswordDialog from '../../components/PasswordDialog';
import { Box, Typography, Divider, Button, DialogActions, TextField } from '@mui/material';
import GlobalSnackbar from '../../components/GlobalSnackbar';
require("./home.css");

const TodoList = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const TETRIS_STATE_SEED = config.TETRIS_STATE_SEED;
  const TETRIS_VAULT_SEED = config.TETRIS_VAULT_SEED;
  const TETRIS_USER_STATE_SEED = config.TETRIS_USER_STATE_SEED;
  const TRUMP_MINT = new PublicKey(config.TRUMP_MINT); //川普币Mint地址
  const TRUMP_VAULT_SEED = config.TRUMP_VAULT_SEED // 川普币金库种子
  const network = config.network;
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const { t } = useTranslation();
  let wallet = useAnchorWallet();

  const PROGRAM_ID = new PublicKey(config.PROGRAM_ID);
  const TREASURY = new PublicKey(config.TREASURY);

  // 点击密码确定
  const handlePasswordConfirm = async () => {
    try {
      const res = await apiService.user.bindInvate({ invite_code: password })
    } catch (error) {
      console.log(error);

    }
    console.log('输入的邀请码:', password);
    setPassword("")
    setPasswordOpen(false)
  }

  const handleClosePasswordDialog = () => {
    setPasswordOpen(false)
  }

  const handlePwdInputChange = (event: any) => {
    setPassword(event.target.value);
  };


  //定义全局program
  const getProgram = () => {
    const provider = getProvider();

    if (!provider) return null;
    // idl：合约的接口定义（就像API文档） 
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);
    // program：用来调用合约函数的工具 使用合约的接口定义创建与智能合约对话的"电话"
    return new Program(b, idl.metadata.address, provider);
  };

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

  //旧版获取tetris项目方地址函数
  const getVaultKey = async () => {
    const [vaultKey] = await asyncGetPda(
      [Buffer.from(TETRIS_VAULT_SEED)],
      PROGRAM_ID
    );
    // console.log(vaultKey.toBase58())
    return vaultKey;
  };

  // 新版获取川普币项目方金库
  const getTrumpVaultKey = async () => {
    const [vaultKey] = await asyncGetPda(
      [Buffer.from(TRUMP_VAULT_SEED)],
      PROGRAM_ID
    );
    return vaultKey;
  };

  // 用种子 "user_state" + 用户钱包地址 通过PDA算法生成
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

  const [tetriSolNum, setTetriSol] = useState<any>('')

  let [referral, getReferral] = useState<any>('')

  let [rewards, setReward] = useState<any>('0.00')


  // let referralUrl = 'https//www.tetriSol.net/home?referral=' + referral
  // https://tetrisol.net/home
  let [referralUrl, setReferralUrl] = useState<any>('https://www.tetrisol.net/home?referral=')

  let amount: any;
  let userState: any;
  let cachedPrice = 0;
  let lastFetchTime = 0;

  //获取钱包的信息 合约globalState
  const getData = async () => {

    const program = getProgram()
    const currentTime = (new Date().getTime() / 1000).toFixed(0);
    //合约的全局设置信息
    let globalStateKey = await getGlobalStateKey();
    let globalData = await program?.account.globalState.fetch(globalStateKey);
    // console.log(`globalData :`, globalData)

    // console.log('startTime', globalData.startTime.toString())
    const now = Date.now();
    // Vérifier si le prix est déjà en cache et si le dernier fetch est récent
    if (cachedPrice !== 0 && now - lastFetchTime < 600000) { // 10 minutes
      return Promise.resolve(cachedPrice);
    }

    const response = await axios.get('https://api.dexscreener.com/latest/dex/tokens/5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7');
    // console.log(`price :`, response.data['pairs'][0].priceUsd)
    cachedPrice = response.data['pairs'][0].priceUsd;
    // console.log("从DexScreener获取SOL的美元价格:",cachedPrice);
    // console.log("wallet",wallet);

    // debugger
    if (wallet) {

      setReferralUrl('https://www.tetrisol.net/home?referral=' + wallet.publicKey) //更新推荐链接
      //teriSolMount
      userState = { teriSolMount: 0.00, referral: null }
      try {
        // 如果有钱包连接，获取用户数据，类似专属档案柜编号
        let userStateKey = await getUserStateKey(wallet.publicKey);
        userState = await program?.account.userState.fetch(userStateKey);
        console.log(`userState :`, userState)

        amount = Number(userState.settlement.toString()) / 1000000000
        amount += Number(((Number(currentTime) - Number(userState.timestamp.toString())) * globalData?.totalSol * userState.teriSolMount * globalData?.perReward / globalData?.totalTeriSol) / 1000000000000000000)

        if (Number.isNaN(amount)) {
          amount = 0.00
        }
        setReward(amount.toFixed(9)) // 更新收益显示
        getReferral(userState.referral.toString())  // 更新推荐人
      } catch (error) {
        console.log(`userState error :`, error)
      }
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

    //合约的金库地址，所有用户质押都存放在这里
    let vaultKey = await getVaultKey();
    if (wallet) {
      //获取到的用户的钱包地址，类似邮箱地址
      let key1 = wallet.publicKey
      const tx = await program.transaction.hatchTetris(
        //BN->获取到的下单的金额
        {
          accounts: {
            user: wallet.publicKey, // 告诉合约：谁在操作
            globalState: await getGlobalStateKey(), // 全局状态
            vault: vaultKey, // 资金池
            userState: await getUserStateKey(wallet.publicKey), // 用户数据
            rent: SYSVAR_RENT_PUBKEY, //Solana存储租金系统
            systemProgram: SystemProgram.programId, // Solana系统程序
          },
        });
      tx.feePayer = key1 // 设置付费者（用户自己付Gas费）

      const connection = new Connection(network, "processed");
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash // 获取最新的区块哈希（交易有效期）
      const signedTx = await wallet.signTransaction(tx) // 用户用钱包签名（授权交易）
      const txId = await connection.sendRawTransaction(signedTx.serialize()) // 发送交易到区块链
      await connection.confirmTransaction(txId) // 等待交易确认

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

    //合约的金库地址，所有用户质押的代币都存放在这里
    let vaultKey = await getVaultKey();
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
      // 获取相关ATA地址 每个代币Mint + 钱包地址 = 唯一的ATA
      /**
       * 一个钱包可以持有多种代币（SOL、USDC、川普币等）

每种代币都需要单独的"保险箱"来存储

ATA就是这个保险箱的地址
       */
      const userTrumpATA = await getAssociatedTokenAddress(TRUMP_MINT, wallet.publicKey);
      const trumpVaultKey = await getTrumpVaultKey(); //所有用户质押的川普币都存放在这里
      // console.log('邀请人的钱包地址', referral)
      //获取到的用户的钱包地址
      const tx = await program.transaction.buyTetris(
        //BN->获取到的下单的金额 将用户输入的SOL数量转换为链上精度
        new anchor.BN(tetriSolNum * 1000000000), {
        accounts: {
          user: key1, //获取到的用户的钱包地址
          globalState: await getGlobalStateKey(),
          treasury: TREASURY, //// 国库地址（收手续费）
          vault: vaultKey, // 资金池
          userState: await getUserStateKey(key1),  // 购买者数据
          systemProgram: SystemProgram.programId,
          referral: referralKey, //邀请人的钱包地址
          referralState: await getUserStateKey(referralKey),  // 邀请人数据
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

  const handleTransfer = async () => {
    if (!connected || !publicKey) {
       setToast({open:true,message:t("assets.text31"),type:"error"})
      return;
    }

    if (!inputValue || Number(inputValue) <= 0) {
      setToast({open:true,message:t("assets.text32"),type:"error"})
      return;
    }

    setLoading(true);
    try {
      console.log("开始分发交易...");

      // 1. 创建provider（使用你现有的getProvider）
      const provider = getProvider();
      if (!provider) {
        throw new Error('无法创建provider');
      }

      // 2. 创建交易
      const tx = await transferAndSplit(provider, publicKey, Number(inputValue));

      console.log("交易创建成功:", tx);

      // 3. 设置交易费用和区块哈希
      tx.feePayer = publicKey;
      const connection = new Connection(network, "processed");
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // 4. 签名并发送（使用你现有的钱包签名方式）
      const signedTx = await wallet?.signTransaction(tx);
      if (!signedTx) {
        throw new Error('签名交易失败');
      }

      const txId = await connection.sendRawTransaction(signedTx.serialize());
      console.log("交易发送成功，ID:", txId);

      // 5. 确认交易（使用你现有的确认方式）
      await connection.confirmTransaction(txId);

      alert(`转账成功！交易ID: ${txId}`);
      setInputValue('');
      setError('');

    } catch (error: any) {
      console.error('完整的错误信息:', error);

      if (error.message.includes("vec")) {
        alert('合约IDL格式不兼容，请联系后端更新IDL文件');
      } else if (error.message.includes("Non-base58")) {
        alert('地址格式错误，请检查合约配置');
      } else {
        alert(`转账失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  /**useEffect替代生命周期函数componentDidMount和componentDidUpdate */
  useEffect(() => {
    // getData()
    // setInterval(() => {
    //   getData()
    // }, 15000)
    // console.log("componentDidMount");
  }, [wallet])

  // 处理输入框变化
  const handleInputChange = (event: any) => {
    const value = event.target.value;

    // 只允许输入数字
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      // 实时验证
      validateInput(value);
    }
  };

  // 验证输入
  const validateInput = (value: string) => {
    if (!value) {
      setError("");
      return;
    }

    const numValue = parseInt(value);

    if (numValue < 10) {
      setError(t("assets.text19") || "最小数量为10");
    } else if (numValue % 10 !== 0) {
      setError(t("assets.text20") || "必须输入10的倍数");
    } else {
      setError("");
    }
  };

  // 失去焦点时验证
  const handleBlur = () => {
    validateInput(inputValue);
  };

  // 按钮点击开始输入
  const handleButtonClick = () => {
    setIsEditing(true);
    setInputValue("");
    setError("");
  };


  return (
    <div className="content">
      {/* 标题和标语 */}
      <Box sx={{ textAlign: 'center', mb: 3, marginTop: "400px", padding: "0 28px" }}>
        <Typography
          onClick={getData}
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#FFF',
            mb: "20px",
            fontSize: "32px"
          }}
        >
          Fighting DAO
        </Typography>

        <Typography
          color={"rgba(255, 255, 255, 0.60)"}
          variant="h6"
          sx={{
            lineHeight: 1.6,
            mb: "40px",
            fontSize: "14px",
          }}
        >
          {t("welcome")}
        </Typography>

        {/* 分割线 */}
        <Divider sx={{ my: 3 }} />
      </Box>

      {/* 选择贡献数量标题 */}
      {!isEditing ? (
        // 初始状态 - 按钮
        <Button
          variant="outlined"
          fullWidth
          onClick={handleButtonClick}
          sx={{
            py: 1,
            bgcolor: "#A069F6",
            borderRadius: "30px",
            border: "none",
            color: "#fff",
            height: "50px",
            fontSize: "16px",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#8a5cf0",
              border: "none"
            }
          }}
        >
          {t("chooseNum")}
        </Button>
      ) : (
        // 编辑状态 - 输入框
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t("assets.text17") || "请输入贡献数量..."}
            type="text"
            inputMode="numeric"
            fullWidth
            error={!!error}
            helperText={error || (t("assets.text18") || "提示: 最小10，且为10的倍数")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                height: "50px",
                backgroundColor: "transparent",

                // 默认状态边框
                "& fieldset": {
                  border: "2px solid #8a5cf0",
                  borderRadius: "30px",
                },

                // 悬停状态边框
                "&:hover fieldset": {
                  border: "2px solid #A069F6",
                },

                // 聚焦状态边框
                "&.Mui-focused fieldset": {
                  border: "2px solid #A069F6",
                  boxShadow: "0 0 0 2px rgba(160, 105, 246, 0.1)"
                },

                // 错误状态边框
                "&.Mui-error fieldset": {
                  border: "2px solid #ff4d4f",
                }
              },

              "& .MuiOutlinedInput-input": {
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fff",
                padding: "12px 20px",
                height: "26px"
              },

              "& .MuiFormHelperText-root": {
                textAlign: "center",
                marginTop: "4px",
                fontSize: "12px",
                marginLeft: "0",
                marginRight: "0",
                color: "#fff",
              }
            }}
          />
        </Box>
      )}


      {/* 贡献方式选择 */}
      <DialogActions sx={{ p: 2, gap: 1, padding: "24px 0 0 0 " }}>
        <Button
          onClick={handleTransfer}
          variant="outlined"
          fullWidth
          sx={{
            py: 1,
            bgcolor: "#CFF174",
            borderRadius: "30px",
            border: "none",
            color: "#333",
            height: "50px"
          }}
        >
          {t("walletTransIn")}
        </Button>
      </DialogActions>

      <PasswordDialog
        password={password}
        open={passwordOpen}
        onClose={handleClosePasswordDialog}
        onConfirm={handlePasswordConfirm}
        title={t("bindInviter")}
        buttonText={t("confirm")}
        inputPlaceholder={t("inputInviteCode")}
        onInputChange={handlePwdInputChange}
      />

      <GlobalSnackbar
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.type}
      />
    </div>
  );
}

export default TodoList;