import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import React from "react";
import { useGlobalState } from "../../context";
import { Button } from "../button";

export const WalletPanel = () => {
  const { account, createAccount } = useGlobalState();

  const handleCopyAccount = () => {
    if (account) {
      copy(account?.publicKey.toString());
    }
  };

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        {account ? (
          <p
            className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={handleCopyAccount}
          >
            {account ? account.publicKey.toString() : "Specify"}
            <FontAwesomeIcon icon={faCopy} className="ml-2" />
          </p>
        ) : (
          <Button text="New" onClick={createAccount} />
        )}
      </div>
    </div>
  );
};
