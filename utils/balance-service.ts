import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
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
import { AccountBalance, DropAccount, TokenAccount } from "../context";

const getTokens = async (
  cluster: Cluster,
  accountId: string
): Promise<TokenAccount[]> => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(accountId),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  return tokenAccounts.value.map((accountBuffer) => {
    const accountInfo = AccountLayout.decode(accountBuffer.account.data);

    return {
      address: accountInfo.mint.toString(),
      amount: accountInfo.amount,
    };
  });
};

const getBalance = async (cluster: Cluster, accountId: string) => {
  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const publicKey = new PublicKey(accountId);
    const balance = await connection.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    throw new Error(`Balance refresh failed: ${errorMessage}`);
  }
};

const getAccountBalance = async (
  cluster: Cluster,
  accountId: string
): Promise<AccountBalance> => {
  const balance = getBalance(cluster, accountId);
  const tokens = getTokens(cluster, accountId);
  return Promise.all([balance, tokens]).then(([balance, tokens]) => ({
    balance,
    tokens,
  }));
};

const drop = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: DropAccount[]
): Promise<string> => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  const transaction = new Transaction();
  dropAccounts.forEach(({ wallet: accountId, drop: amount }) => {
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

const dropDev = async (
  cluster: Cluster,
  account: Keypair | null
): Promise<number> => {
  // This line ensures the function returns before running if no account has been set
  if (!account || cluster !== "devnet") return 0;

  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const publicKey = account.publicKey;
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    return getBalance(cluster, account.publicKey.toString());
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    throw new Error(`Airdrop failed: ${errorMessage}`);
  }
};

export const BalanceService = { getAccountBalance, getBalance, dropDev, drop };
