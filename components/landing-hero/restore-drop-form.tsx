import React from "react";
import { useForm } from "react-hook-form";
import { useGlobalState } from "../../context";
import { AccountRestoreForm } from "../../utils/account-service";
import { classNames } from "../../utils/class-names";

export function RestoreDropForm() {
  const { restoreAccount } = useGlobalState();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountRestoreForm>();

  return (
    <form className="flex flex-1 h-10" onSubmit={handleSubmit(restoreAccount)}>
      <div className="flex flex-1">
        <label htmlFor="email" className="sr-only">
          Mnemonic
        </label>
        <input
          className="border-b bg-transparent focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:border-b-2 block w-full sm:text-sm border-gray-300 py-2 px-2"
          placeholder="Mnemonic"
          {...register("mnemonic")}
        />
      </div>
      <button
        type="submit"
        className={classNames(
          isSubmitting
            ? "text-indigo-600 bg-white"
            : "text-white bg-indigo-600",
          "font-mono rounded-full uppercase text-xs items-center justify-center px-6 py-2 border border-transparent shadow-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3"
        )}
      >
        Restore
      </button>
    </form>
  );
}
