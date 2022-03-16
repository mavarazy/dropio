import {
  AccountLayout,
  createTransferCheckedInstruction,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
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
import {
  WalletBallance,
  DropAccount,
  TokenAccount,
  DropMode,
} from "../context";

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
      amount: Number(accountInfo.amount),
    };
  });
};

const getSolBalance = async (cluster: Cluster, accountId: string) => {
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

const getWalletBalance = async (
  cluster: Cluster,
  accountId: string
): Promise<WalletBallance> => {
  const sol = getSolBalance(cluster, accountId);
  const tokens = getTokens(cluster, accountId);
  return Promise.all([sol, tokens]).then(([sol, tokens]) => ({
    id: accountId,
    sol,
    tokens,
  }));
};

const dropSol = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: DropAccount[]
) => {
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

const dropTokkens = async (
  cluster: Cluster,
  account: Keypair,
  tokenAddress: string,
  dropAccounts: DropAccount[]
) => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const mint = new PublicKey(tokenAddress);

  const mintAccount = await getMint(connection, mint);

  const transaction = new Transaction({
    feePayer: account.publicKey,
  });

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    account,
    mint,
    account.publicKey
  );

  await dropAccounts.reduce((agg, dropAccount) => {
    return agg.then(async () => {
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        account,
        new PublicKey(tokenAddress),
        new PublicKey(dropAccount.wallet)
      );
      const transferInstruction = createTransferCheckedInstruction(
        fromTokenAccount.address,
        mint,
        toTokenAccount.address,
        account.publicKey,
        dropAccount.drop * Math.pow(10, mintAccount.decimals),
        mintAccount.decimals
      );
      transaction.add(transferInstruction);
      return true;
    });
  }, Promise.resolve(true));

  const signers = [
    {
      publicKey: account.publicKey,
      secretKey: account.secretKey,
    },
  ];

  return await sendAndConfirmTransaction(connection, transaction, signers);
};

const drop = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: DropAccount[],
  mode: DropMode,
  tokenAddress: string
): Promise<string> => {
  if (mode === "SOL") {
    return dropSol(cluster, account, dropAccounts);
  }

  return dropTokkens(cluster, account, tokenAddress, dropAccounts);
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
    return getSolBalance(cluster, account.publicKey.toString());
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    throw new Error(`Airdrop failed: ${errorMessage}`);
  }
};

export const BalanceService = {
  getWalletBalance,
  dropDev,
  drop,
};
