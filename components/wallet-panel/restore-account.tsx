import React, { useState, useEffect, ReactElement } from "react";

import Link from "next/link";

export const RestoreAccount = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleGetWallet = () => {
    setLoading(true);
  };

  return (
    <div className={"buttons"}>
      {!loading && (
        <Link href={`/recover`} passHref>
          <button onClick={handleGetWallet}>Restore</button>
        </Link>
      )}
    </div>
  );
};

export default RestoreAccount;
