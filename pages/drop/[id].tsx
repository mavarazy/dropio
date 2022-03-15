import React, { useContext } from "react";
import type { NextPage } from "next";
import DropTable from "../../components/drop-table/drop-table";
import { SendPanel } from "../../components/send-panel";
import { WalletHeader } from "../../components/wallet-header";
import { useRouter } from "next/router";
import { useGlobalState } from "../../context";
import { StackingPicker } from "../../components/stacking-nav";

const Drop: NextPage = () => {
  const router = useRouter();
  const { setAccountId } = useGlobalState();
  const { id } = router.query;
  if (id && !Array.isArray(id)) {
    setAccountId(id);
  }

  return (
    <main className="flex flex-1 flex-col">
      <WalletHeader />
      <div className="flex flex-1 justify-center sm:px-6 lg:px-8">
        <div className="max-w-5xl flex flex-1 flex-col">
          <StackingPicker />
          <SendPanel />
          <DropTable />
        </div>
      </div>
    </main>
  );
};

export default Drop;
