import { faPersonDigging, faRaindrops } from "@fortawesome/pro-light-svg-icons";
import { useGlobalState } from "../../context";
import { Button } from "../button";

export const DebugButton = () => {
  const {
    state: { cluster, mode },
    dropDev,
    mineDev,
  } = useGlobalState();

  if (cluster !== "devnet") {
    return null;
  }

  if (mode === "SOL") {
    return <Button icon={faRaindrops} onClick={dropDev} />;
  }

  return <Button icon={faPersonDigging} onClick={mineDev} />;
};
