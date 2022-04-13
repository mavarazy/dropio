import { faPersonDigging, faRaindrops } from "@fortawesome/pro-light-svg-icons";
import { useGlobalState } from "../../../context";
import { Button } from "../../button";
import { DevService } from "../../../utils/dev-service";
import { PublicKey } from "@solana/web3.js";
import { MintSlideOver, MintSlideOverRef } from "./mint-slide-over";
import { useRef } from "react";

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
  const mintRef = useRef<MintSlideOverRef>(null);

  const handleAirDrop = async () => {
    try {
      await DevService.drop(cluster, new PublicKey(id));
      await refreshBalance();
    } catch (error) {
      onError(error);
    }
  };

  const handleMint = async () => {
    mintRef.current?.open();
  };

  if (cluster !== "devnet") {
    return null;
  }

  return (
    <>
      <div className="flex space-x-2 mx-2">
        <Button icon={faRaindrops} text="Drop me" onClick={handleAirDrop} />
        {accountInfo && (
          <Button icon={faPersonDigging} text="Mint me" onClick={handleMint} />
        )}
      </div>
      <MintSlideOver ref={mintRef} />
    </>
  );
};
