// Import any additional classes and/or functions needed from Solana's web3.js library as you go along:
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as Bip39 from "bip39";
import { DropAccount } from "../context";

const getBalance = async (network: Cluster, accountId: string) => {
  try {
    const connection = new Connection(clusterApiUrl(network), "confirmed");
    const publicKey = new PublicKey(accountId);
    const balance = await connection.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    throw new Error(`Balance refresh failed: ${errorMessage}`);
  }
};

const refreshBalance = async (
  network: Cluster | undefined,
  account: Keypair | null
): Promise<number> => {
  // This line ensures the function returns before running if no account has been set
  if (!account) return 0;

  try {
    const connection = new Connection(clusterApiUrl(network), "confirmed");
    const publicKey = account.publicKey;
    const balance = await connection.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    throw new Error(`Balance refresh failed: ${errorMessage}`);
  }
};

const createAccount = async (): Promise<{
  account: Keypair;
  mnemonic: string;
}> => {
  const mnemonic = Bip39.generateMnemonic();

  const seed = Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);
  const account = Keypair.fromSeed(seed);

  return { account, mnemonic };
};

const restoreAccount = async (mnemonic: string): Promise<Keypair> => {
  const inputMnemonic = mnemonic.trim().toLowerCase();

  const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);

  return Keypair.fromSeed(seed);
};

const drop = async (
  network: Cluster,
  account: Keypair,
  dropAccounts: DropAccount[]
): Promise<string> => {
  const connection = new Connection(clusterApiUrl(network), "confirmed");

  const transaction = new Transaction();
  dropAccounts.forEach(({ accountId, amount }) => {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey: new PublicKey(accountId),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
  });

  const signers = [
    {
      publicKey: account.publicKey,
      secretKey: account.secretKey,
    },
  ];

  return await sendAndConfirmTransaction(connection, transaction, signers);
};

const dropMe = async (network: Cluster, account: Keypair | null) => {
  // This line ensures the function returns before running if no account has been set
  if (!account) return;

  try {
    const connection = new Connection(clusterApiUrl(network), "confirmed");
    const publicKey = account.publicKey;
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    const result = await connection.confirmTransaction(
      airdropSignature,
      "confirmed"
    );
    return await refreshBalance(network, account);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    throw new Error(`Airdrop failed: ${errorMessage}`);
  }
};

export {
  createAccount,
  getBalance,
  refreshBalance,
  dropMe as handleAirdrop,
  drop,
  restoreAccount,
};
