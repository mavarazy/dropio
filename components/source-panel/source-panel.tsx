import { FileInput } from "../file-input";
import Papa from "papaparse";
import { DropAccount, useGlobalState } from "../../context";
import { NumberUtils } from "../../utils/number-utils";

export function SourcePanel() {
  const { setDropAccounts } = useGlobalState();

  const handleImport = async (files: FileList) => {
    const file = files.item(0);
    if (file === null) {
      return;
    }

    const source = await file.text();

    const result = Papa.parse(source, {
      header: true,
      transform: (value, field) => {
        return field === "drop"
          ? NumberUtils.parseLamport(value.replaceAll("\"|'", ""))
          : value;
      },
    });

    setDropAccounts(result.data as DropAccount[]);
  };

  return (
    <div className="flex justify-end mb-4">
      <FileInput onChange={handleImport} />
    </div>
  );
}
