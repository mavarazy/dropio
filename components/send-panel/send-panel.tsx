import { faDropbox } from "@fortawesome/free-brands-svg-icons";
import { faRefresh } from "@fortawesome/pro-light-svg-icons";
import { faCashRegister, faSync } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalState } from "../../context";

export const SendPanel = () => {
  const { account, balance, dropAccounts, dropDev, refreshBalance, drop } =
    useGlobalState();

  const dropAmount = dropAccounts.reduce((agg, { amount }) => agg + amount, 0);

  const handleSend = () => {
    if (account) {
      drop(dropAccounts);
    }
  };

  return (
    <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow-lg divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900">Balance</dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
            {balance}
          </div>
          <div className="flex space-x-1">
            <button
              className="flex px-2 py-2 bg-indigo-600 text-white rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out"
              onClick={refreshBalance}
            >
              <FontAwesomeIcon icon={faSync} />
            </button>
            <button
              className="flex px-2 py-2 bg-green-600 text-white rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out"
              onClick={dropDev}
            >
              <FontAwesomeIcon icon={faDropbox} />
            </button>
          </div>
        </dd>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900">Drop Amount</dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
            {dropAmount}
          </div>
        </dd>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900"></dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <button
            className="flex px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out mx-auto"
            onClick={handleSend}
          >
            <FontAwesomeIcon icon={faCashRegister} className="mr-4" />
            <span className="text-xs font-bold">Send</span>
          </button>
        </dd>
      </div>
    </dl>
  );
};
