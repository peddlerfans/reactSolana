// src/utils/contract.ts
import { Program, Provider, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONTRACT_CONFIG } from "../common/contract";
import { validateAddress, validateAllAddresses } from "./addressUtils";
// 直接使用你现有的IDL格式
import { CreateMintAccount } from "../create_mint_account";

export const getDistributionProgram = (provider: Provider) => {
    const program = new Program(
        CreateMintAccount as any,
        CONTRACT_CONFIG.PROGRAM_ID,
        provider
    );
    return program;
};

export const getConfigPDA = async (): Promise<PublicKey> => {
    try {
        const [configPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("config")],
            new PublicKey(CONTRACT_CONFIG.PROGRAM_ID)
        );
        console.log("Config PDA:", configPDA.toString());
        return configPDA;
    } catch (error) {
        console.error("创建PDA失败:", error);
        throw new Error(`无法创建配置账户PDA，程序ID可能无效: ${CONTRACT_CONFIG.PROGRAM_ID}`);
    }
};

export const transferAndSplit = async (
    provider: Provider,
    userWallet: PublicKey,
    amount: number
) => {

    // 验证所有地址
    if (!validateAllAddresses()) {
        throw new Error("合约配置地址无效，请检查config文件");
    }

    const program = getDistributionProgram(provider);

    // 获取用户USDT账户
    const userTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(CONTRACT_CONFIG.USDT_MINT),
        userWallet
    );

    // 获取配置账户
    const configAccount = await getConfigPDA();

    console.log("=== 交易参数调试 ===");
    console.log("用户钱包:", userWallet.toString());
    console.log("用户USDT账户:", userTokenAccount.toString());
    console.log("配置账户:", configAccount.toString());
    console.log("金额:", amount);
    console.log("===================");

    // 使用你现有的transaction调用方式（与onBuyTetris一致）
    const tx = await program.transaction.transferAndSplit(
        new (program as any).provider.BN(amount * (10 ** 6)), // USDT有6位小数
        {
            accounts: {
                user: userWallet,
                userTokenAccount: userTokenAccount,
                config: configAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        }
    );

    return tx;
};