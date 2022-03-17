import { TokenInfo } from "@solana/spl-token-registry";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DropMode } from "../context";

const getHumanAmount = (
  amount: number | bigint,
  mode: DropMode,
  token: TokenInfo
) =>
  mode === "SOL"
    ? Number(amount) / LAMPORTS_PER_SOL
    : Number(amount) / Math.pow(10, token.decimals);

export const TokenUtils = {
  getHumanAmount,
};
