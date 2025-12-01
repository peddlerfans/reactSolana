import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react"; // 🌟 引入 useWallet
import {
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import config from "../common/config.json";
import { useSnackbar } from "../utils/SnackbarContext";
import { useTranslation } from "react-i18next";

export const useSolanaTransfer = () => {
  // 🌟 从 useWallet 获取所需的变量和方法
  const { 
    wallet, 
    connected, 
    publicKey, 
    sendTransaction 
    /* signTransaction 也可以通过 wallet.adapter 访问 */
  } = useWallet();
  
  const [isSigning, setIsSigning] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // --- 辅助函数 (保持不变或微调) ---

  /** 验证交易数据 */
  const validateTransactionItem = (item) => {
    if (!item) {
      throw new Error("交易数据为空");
    }
    if (!item.txBase64 || typeof item.txBase64 !== 'string') {
      throw new Error("交易数据缺少或 txBase64 字段类型不正确");
    }
    // 简单的 Base64 格式验证
    if (!item.txBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      throw new Error("txBase64 格式不正确");
    }
  };

  /** 检查 blockhash 是否过期 */
  const isBlockhashExpired = async (connection, item) => {
    // 如果没有提供 lastValidBlockHeight，则跳过检查
    if (!item.lastValidBlockHeight) return false; 
    
    try {
      const current = await connection.getBlockHeight();
      return current > item.lastValidBlockHeight;
    } catch (error) {
      console.warn("检查区块高度失败:", error);
      return false;
    }
  };

  /** 解码交易 */
  const decodeTransaction = (item) => {
    try {
      validateTransactionItem(item);
      const raw = Buffer.from(item.txBase64, "base64");
      
      if (!raw || raw.length === 0) {
        throw new Error("交易数据解码后为空");
      }

      // 尝试解析 VersionedTransaction，失败则尝试 Transaction
      try {
        return {
          tx: VersionedTransaction.deserialize(raw),
          isVersioned: true,
        };
      } catch (e) {
        return {
          tx: Transaction.from(raw),
          isVersioned: false,
        };
      }
    } catch (error) {
      console.error("解码交易失败:", error);
      throw new Error(`交易数据解析失败: ${error.message}`);
    }
  };

  /** 准备交易：解码、检查 Blockhash 并更新（如果需要） */
  const prepareTransaction = useCallback(async (item) => {
    try {
      if (!item) {
        throw new Error("交易数据不存在");
      }

      // 确保 RPC URL 可用
      const rpcUrl = config.rpcUrl || config.network;
      if (!rpcUrl) {
          throw new Error("未配置 Solana RPC URL");
      }
      
      const connection = new Connection(rpcUrl, "confirmed");

      // 1. 解码
      const { tx, isVersioned } = decodeTransaction(item);

      // 2. 检查 blockhash
      const expired = await isBlockhashExpired(connection, item);
      if (expired) {
        console.warn("区块哈希已过期，获取最新区块哈希");
        const fresh = await connection.getLatestBlockhash("finalized");

        // 只有非版本化交易可以原地修改 blockhash
        if (!isVersioned && tx instanceof Transaction) {
          tx.recentBlockhash = fresh.blockhash;
        }
        
        // 更新 Item 的 blockhash 信息，供外部使用
        item.blockhash = fresh.blockhash;
        item.lastValidBlockHeight = fresh.lastValidBlockHeight;
      }

      return { tx, connection, expired };
    } catch (error) {
      console.error("准备交易失败:", error);
      throw error;
    }
  }, [t]); // 依赖项中加入 t，确保在语言变化时重新创建

  /** 核心执行逻辑：签名并发送交易 */
  const signAndSendSingle = useCallback(async (tx, connection) => {
    const adapter = wallet?.adapter;

    if (!adapter) {
      throw new Error(t("sign.text6")); // 钱包未连接
    }

    try {
      // 优先使用 adapter 的 signTransaction + 手动发送 (通常更快、更透明)
      if (typeof adapter.signTransaction === "function") {
        const signed = await adapter.signTransaction(tx);
        
        // 确保发送参数符合您的需求
        const signature = await connection.sendRawTransaction(signed.serialize(), {
          skipPreflight: true,
          preflightCommitment: "confirmed",
        });
        return signature;
      }

      // 其次，使用 useWallet 提供的 sendTransaction (依赖 adapter 内部实现)
      return await sendTransaction(tx, connection, {
          skipPreflight: true,
          preflightCommitment: "confirmed",
      });
      
    } catch (error) {
      console.error("签名发送失败:", error);
      throw error;
    }
  }, [wallet, sendTransaction, t]);


  // --- 用户触发的主函数 ---
  
  /** 用户触发：签名一笔交易 */
  const signSingleTransfer = useCallback(async (item) => {
    if (isSigning) {
      showSnackbar("正在处理上一笔交易，请稍候", "warning");
      return;
    }
    
    // 🌟 关键：检查钱包连接状态
    if (!connected || !publicKey || !wallet) {
        showSnackbar(t("sign.text6"), "error"); // 提示连接钱包
        return;
    }

    try {
      setIsSigning(true);
      
      console.log("接收到的交易数据:", item);

      // 准备交易（解码并检查 Blockhash）
      const { tx, connection } = await prepareTransaction(item);

      // 执行签名和发送
      const signature = await signAndSendSingle(tx, connection);
      return signature;

    } catch (error) {
      console.error("签名交易失败:", error);
      
      let errorMessage = t("error.text1");
      
      // 钱包取消/拒绝的错误处理
      if (error.message?.includes("user rejected") || error.message?.includes("denied")) {
        errorMessage = "您取消了交易签名";
      } 
      // 资金不足的错误处理
      else if (error.message?.includes("insufficient funds")) {
        errorMessage = "SOL 余额不足，请确保有足够 SOL 支付网络费用";
      } 
      // 交易数据解析错误处理
      else if (error.message?.includes("交易数据解析失败")) {
        errorMessage = "交易数据格式错误，请重新尝试";
      }
      
      showSnackbar(errorMessage, "error");
      throw error;
    } finally {
      setIsSigning(false);
    }
  }, [isSigning, connected, publicKey, wallet, showSnackbar, t, prepareTransaction, signAndSendSingle]); // 完整依赖项

  // --- 返回值 ---

  return {
    signSingleTransfer,
    isSigning,
    isConnected: connected, // 可选：返回连接状态
    walletPublicKey: publicKey, // 可选：返回公钥
  };
};