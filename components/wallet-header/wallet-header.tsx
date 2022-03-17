import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import React from "react";
import { useGlobalState } from "../../context";
import { RestoreDropForm } from "../landing-hero/restore-drop-form";

interface CopiableTextProps {
  text: string;
}

const CopiableText: React.FC<CopiableTextProps> = ({ text }) => {
  const handleTextCopy = () => {
    copy(text);
  };

  return (
    <p
      className="text-sm text-blue-500 font-medium cursor-pointer rounded-full hover:text-blue-800"
      onClick={handleTextCopy}
    >
      {text}
      <FontAwesomeIcon icon={faCopy} className="ml-1" />
    </p>
  );
};

export const WalletHeader = () => {
  const {
    state: { balance },
    accountInfo,
  } = useGlobalState();

  return (
    <header className="bg-gray-50 shadow  flex py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 max-w-6xl self-center mx-auto">
        <div className="flex flex-col text-left flex-1">
          <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
          {balance.id && <CopiableText text={balance.id} />}
        </div>
        {accountInfo?.mnemonic ? (
          <div className="flex flex-1 flex-col text-right">
            <h1 className="text-xl font-bold text-gray-900">Mnemonic</h1>
            <CopiableText text={accountInfo?.mnemonic} />
          </div>
        ) : (
          <div className="flex flex-1 justify-end py-1 max-w-2xl">
            <RestoreDropForm />
          </div>
        )}
      </div>
    </header>
  );
};
