import { createMint } from "@solana/spl-token";
import { Cluster, clusterApiUrl, Connection, Keypair } from "@solana/web3.js";

const mintTokens = async (network: Cluster) => {
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();

  const connection = new Connection(clusterApiUrl(network), "confirmed");

  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9
  );

  return mint.toBase58();
};

export { mintTokens };
