import { faPersonDigging, faRaindrops } from "@fortawesome/pro-light-svg-icons";
import { useGlobalState } from "../../context";
import { Button } from "../button";
import { DevService } from "../../utils/dev-service";
import { PublicKey } from "@solana/web3.js";

export const DevPanel = () => {
  const {
    state: {
      cluster,
      balance: { id },
    },
    accountInfo,
    onError,
    refreshBalance,
  } = useGlobalState();

  const handleAirDrop = async () => {
    try {
      await DevService.drop(cluster, new PublicKey(id));
      await refreshBalance();
    } catch (error) {
      onError(error);
    }
  };

  const handleMint = async () => {
    try {
      if (accountInfo) {
        await DevService.mint(cluster, accountInfo?.account);
        await refreshBalance();
      }
    } catch (error) {
      onError(error);
    }
  };

  if (cluster !== "devnet") {
    return null;
  }

  return (
    <div className="flex space-x-2 mx-2">
      <Button icon={faRaindrops} text="Drop me" onClick={handleAirDrop} />
      {accountInfo && (
        <Button icon={faPersonDigging} text="Mint me" onClick={handleMint} />
      )}
    </div>
  );
};
