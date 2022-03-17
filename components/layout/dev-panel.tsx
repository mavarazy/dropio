import { faPersonDigging, faRaindrops } from "@fortawesome/pro-light-svg-icons";
import { useGlobalState } from "../../context";
import { Button } from "../button";
import { DevService } from "../../utils/dev-service";

export const DevPanel = () => {
  const {
    state: { cluster },
    accountInfo,
    refreshBalance,
  } = useGlobalState();

  const handleAirDrop = async () => {
    if (accountInfo) {
      await DevService.drop(cluster, accountInfo?.account);
      await refreshBalance();
    }
  };

  const handleMint = async () => {
    if (accountInfo) {
      await DevService.mint(cluster, accountInfo?.account);
      await refreshBalance();
    }
  };

  if (cluster !== "devnet" || accountInfo === null) {
    return null;
  }

  return (
    <div className="flex space-x-2 mx-2">
      <Button icon={faRaindrops} text="Drop" onClick={handleAirDrop} />
      <Button icon={faPersonDigging} text="Mint" onClick={handleMint} />
    </div>
  );
};
