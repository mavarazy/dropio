import {
  faArrowRotateRight,
  faPersonDigging,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mint } from "@solana/spl-token";
import { useForm } from "react-hook-form";
import { useGlobalState } from "../../../context";
import { classNames } from "../../../utils/class-names";

interface Form {
  amount: string;
}

interface MintMoreFormProps {
  mint: Mint;
  onMintMore(mint: Mint, amount: bigint): Promise<void>;
}

export const MintMoreForm: React.FC<MintMoreFormProps> = ({
  mint,
  onMintMore,
}) => {
  const {
    state: { cluster },
  } = useGlobalState();
  const { register, formState, handleSubmit } = useForm<Form>({
    defaultValues: {},
  });

  const onSubmit = async ({ amount }: Form) => {
    await onMintMore(mint, BigInt(amount));
  };

  return (
    <div>
      <a
        href={`https://explorer.solana.com/address/${mint.address.toString()}?cluster=${cluster}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-xs font-bold py-1 px-2 truncate max-w-[100px]">
          {mint.address.toString()}
        </span>
      </a>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 mb-2">
        <input
          type="text"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-full px-4 flex-1"
          placeholder="Amount"
          {...register("amount", { required: true })}
        />
        <button
          type="submit"
          className={classNames(
            formState.isSubmitting
              ? "bg-indigo-50 text-indigo-600 translate-y-1"
              : "bg-indigo-600 text-white",
            "hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out font-mono text-[9px] px-2 py-2 rounded-full shadow-lg uppercase cursor-pointer ml-4"
          )}
        >
          <FontAwesomeIcon
            icon={formState.isSubmitting ? faArrowRotateRight : faPersonDigging}
            className="mx-2"
            spin={formState.isSubmitting}
          />
          <span className="mr-2 my-auto">More</span>
        </button>
      </form>
    </div>
  );
};
