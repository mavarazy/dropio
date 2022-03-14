import React from "react";
import { CreateAccount } from "./create-account";
import { RestoreAccount } from "./restore-account";

export const WalletPanel = () => {
  return (
    <div className="flex flex-1 justify-center">
      <CreateAccount />
    </div>
  );
};
