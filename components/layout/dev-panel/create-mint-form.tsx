import {
  faArrowRotateRight,
  faPersonDigging,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { classNames } from "../../../utils/class-names";

export interface ICreateMintForm {
  digits: number;
  amount: bigint;
}

interface CreateMintFormProps {
  onMint(form: ICreateMintForm): void;
}

export const CreateMintForm: React.FC<CreateMintFormProps> = ({ onMint }) => {
  const { register, formState, handleSubmit } = useForm<ICreateMintForm>({
    defaultValues: {
      digits: 9,
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onMint)} className="flex flex-1 mb-2">
        <input
          type="text"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-full px-4 flex-1"
          placeholder="Amount"
          {...register("amount", { required: true })}
        />
        <select
          {...register("digits")}
          className="mx-4 block pl-3 pr-10 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-full"
        >
          {Array.from(new Array(10), (_, i) => (
            <option value={i} key={i}>
              {i}
            </option>
          ))}
        </select>
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
          <span className="mr-2 my-auto">Create</span>
        </button>
      </form>
    </>
  );
};
