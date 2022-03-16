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
  DropAccountBalance,
  PopulatedDropAccount,
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

const getTokenBalance = async (
  cluster: Cluster,
  account: Keypair,
  wallet: string,
  tokenAddress: string
): Promise<{ address: string; amount: number }> => {
  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const mint = new PublicKey(tokenAddress);

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      account,
      mint,
      new PublicKey(wallet)
    );

    return {
      address: toTokenAccount.address.toString(),
      amount: Number(toTokenAccount.amount) / LAMPORTS_PER_SOL,
    };
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

const getDropAccountBalance = async (
  cluster: Cluster,
  dropAccount: DropAccount,
  account: Keypair,
  mode: DropMode,
  tokenAddress: string
): Promise<DropAccountBalance> => {
  const balance = await (mode === "SOL"
    ? getSolBalance(cluster, dropAccount.wallet).then((amount) => ({
        address: dropAccount.wallet,
        amount,
      }))
    : getTokenBalance(cluster, account, dropAccount.wallet, tokenAddress));

  return {
    ...dropAccount,
    ...balance,
  };
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
  wallet: Keypair,
  tokenAddress: string,
  accounts: PopulatedDropAccount[]
) => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const mint = new PublicKey(tokenAddress);

  const mintAccount = await getMint(connection, mint);

  const transaction = new Transaction({
    feePayer: wallet.publicKey,
  });

  const tokenDropAccounts: DropAccountBalance[] = await accounts.reduce(
    (agg: Promise<DropAccountBalance[]>, account: PopulatedDropAccount) => {
      return agg.then(async (accounts: DropAccountBalance[]) => {
        if (account.address) {
          const dropTokenAccount: DropAccountBalance = {
            ...account,
            address: account.address,
            amount: account.drop,
          };
          return accounts.concat(dropTokenAccount);
        } else {
          const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            new PublicKey(tokenAddress),
            new PublicKey(account.wallet)
          );

          const dropTokenAccount: DropAccountBalance = {
            ...account,
            address: toTokenAccount.address.toString(),
            amount: account.drop,
          };

          return accounts.concat(dropTokenAccount);
        }
      });
    },
    Promise.resolve([])
  );

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );

  await tokenDropAccounts.reduce((agg, tokenDropAccount) => {
    return agg.then(async () => {
      const transferInstruction = createTransferCheckedInstruction(
        fromTokenAccount.address,
        mint,
        new PublicKey(tokenDropAccount.address),
        wallet.publicKey,
        tokenDropAccount.drop * Math.pow(10, mintAccount.decimals),
        mintAccount.decimals
      );
      transaction.add(transferInstruction);
      return true;
    });
  }, Promise.resolve(true));

  const signers = [
    {
      publicKey: wallet.publicKey,
      secretKey: wallet.secretKey,
    },
  ];

  return await sendAndConfirmTransaction(connection, transaction, signers);
};

const drop = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: PopulatedDropAccount[],
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
  getDropAccountBalance,
  dropDev,
  drop,
};
