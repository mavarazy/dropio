import { faCashRegister } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalState } from "../../context";

export const SendPanel = () => {
  const { account, dropAccounts, drop } = useGlobalState();

  const handleSend = () => {
    if (account) {
      drop(dropAccounts);
    }
  };

  return (
    <div className="my-5">
      <button
        className="flex px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out mx-auto"
        onClick={handleSend}
      >
        <FontAwesomeIcon icon={faCashRegister} className="mr-4" />
        <span className="text-xs font-bold">Send</span>
      </button>
    </div>
  );
};
