import {
  faArrowRotateRight,
  faPersonDigging,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { classNames } from "../../../utils/class-names";

export interface DevMintForm {
  mintId?: string;
  amount: bigint;
}

interface MintFormProps {
  mintId?: string;
  onMint(form: DevMintForm): void;
}

export const MintForm: React.FC<MintFormProps> = ({ mintId, onMint }) => {
  const { register, formState, handleSubmit } = useForm<DevMintForm>({
    defaultValues: {
      mintId,
    },
  });

  return (
    <>
      <h4 className="text-xs font-bold py-1 px-2 truncate max-w-[200px]">
        {mintId || "NEW"}
      </h4>
      <form onSubmit={handleSubmit(onMint)} className="flex flex-1">
        <input
          type="text"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-full px-4 flex-1 mr-5"
          placeholder="Amount"
          {...register("amount", { required: true })}
        />
        <button
          type="submit"
          className={classNames(
            formState.isSubmitting
              ? "bg-indigo-50 text-indigo-600 translate-y-1"
              : "bg-indigo-600 text-white",
            "hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out font-mono text-[9px] px-2 py-2 rounded-full shadow-lg uppercase cursor-pointer"
          )}
        >
          <FontAwesomeIcon
            icon={formState.isSubmitting ? faArrowRotateRight : faPersonDigging}
            className="mx-2"
            spin={formState.isSubmitting}
          />
          <span className="mr-2 my-auto">Mint</span>
        </button>
      </form>
    </>
  );
};
