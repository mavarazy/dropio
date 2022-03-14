import React, { useState, useEffect, ReactElement } from "react";
import Link from "next/link";
import { createAccount } from "../../utils";
import { useGlobalState } from "../../context";

export const CreateAccount = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAccount, setMnemonic } = useGlobalState();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);

    const { account, mnemonic } = await createAccount();
    setAccount(account);
    setMnemonic(mnemonic);
  };

  return (
    <div className={"buttons"}>
      {!loading && (
        <Link href="/drop" passHref>
          <button
            className="px-5 py-2 bg-purple-600 text-white font-bold rounded-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            New
          </button>
        </Link>
      )}
    </div>
  );
};

export default CreateAccount;
