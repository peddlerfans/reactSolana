// src/utils/addressUtils.ts
import { PublicKey } from "@solana/web3.js";
import { CONTRACT_CONFIG } from "../common/contract"
export const validateAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateAllAddresses = () => {
  const { PROGRAM_ID, USDT_MINT, TOKEN_PROGRAM_ID } = CONTRACT_CONFIG;
  
  console.log("=== 地址验证 ===");
  console.log("PROGRAM_ID:", PROGRAM_ID, "有效:", validateAddress(PROGRAM_ID));
  console.log("USDT_MINT:", USDT_MINT, "有效:", validateAddress(USDT_MINT));
  console.log("TOKEN_PROGRAM_ID:", TOKEN_PROGRAM_ID, "有效:", validateAddress(TOKEN_PROGRAM_ID));
  console.log("=================");
  
  return validateAddress(PROGRAM_ID) && validateAddress(USDT_MINT) && validateAddress(TOKEN_PROGRAM_ID);
};