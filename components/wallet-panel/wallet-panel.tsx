import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import React from "react";
import { useGlobalState } from "../../context";

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
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={createAccount}
          >
            NEW
          </button>
        )}
      </div>
    </div>
  );
};
