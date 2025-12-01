// src/utils/walletAuth.ts
import { PublicKey } from '@solana/web3.js';
import i18n from 'i18next';
export interface WalletAuthData {
    publicKey: string;
    signature: string;
    message: string;
    signedMessage: string;
    walletName: string;
    timestamp: number;
    network: string;
}
/**
 * 获取完整的钱包授权信息
 */
export const getWalletAuthData = async (
    publicKey: PublicKey,
    signMessage: any,
    walletName: string
): Promise<WalletAuthData> => {   
    try {
        // 创建唯一的登录消息
        // 创建唯一的登录消息
        const timestamp = Date.now();
        const nonce = Math.random().toString(36).substring(2, 15);
        const message = `${i18n.t('message')}\n\nWallet: ${publicKey.toString()}\nTimestamp: ${timestamp}\nWarn: ${nonce}\nNetwork: mainnet`;
        let signature: string;
        let signedMessage: string;

        // 尝试使用 signMessage（Phantom, Solflare 等支持）
        if (signMessage) {
            const encodedMessage = new TextEncoder().encode(message);
            const signatureBytes = await signMessage(encodedMessage);
            signature = Buffer.from(signatureBytes).toString('hex');
            signedMessage = message;
        } else {
            // 备用方案：如果钱包不支持 signMessage，使用其他方式
            throw new Error('当前钱包不支持消息签名');
        }

        return {
            publicKey: publicKey.toString(),
            signature,
            message,
            signedMessage,
            walletName,
            timestamp,
            network: 'mainnet'
        };
    } catch (error: any) {
        console.error('获取钱包授权信息失败:', error);
        throw new Error(`授权失败: ${error.message}`);
    }
};

/**
 * 验证钱包是否支持必要功能
 */
export const validateWalletCapabilities = (wallet: any) => {
    const capabilities = {
        signMessage: !!wallet?.adapter?.signMessage,
        signTransaction: !!wallet?.adapter?.signTransaction,
        publicKey: !!wallet?.publicKey
    };

    console.log('钱包能力检测:', capabilities);
    return capabilities;
};