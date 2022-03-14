import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import React from "react";
import { useGlobalState } from "../../context";

interface CopiableTextProps {
  text: string;
}

const CopiableText: React.FC<CopiableTextProps> = ({ text }) => {
  const handleTextCopy = () => {
    copy(text);
  };

  return (
    <p
      className="text-lg text-blue-500 font-medium cursor-pointer rounded-full hover:text-blue-800"
      onClick={handleTextCopy}
    >
      {text}
      <FontAwesomeIcon icon={faCopy} className="ml-4" />
    </p>
  );
};

export const WalletHeader = () => {
  const { account, mnemonic } = useGlobalState();

  return (
    <header className="bg-gray-50 shadow  flex py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col text-left">
        <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
        {account && <CopiableText text={account.publicKey.toString()} />}
      </div>
      {mnemonic && (
        <div className="flex flex-1 flex-col text-right">
          <h1 className="text-xl font-bold text-gray-900">Mnemonic</h1>
          {mnemonic && <CopiableText text={mnemonic} />}
        </div>
      )}
    </header>
  );
};
