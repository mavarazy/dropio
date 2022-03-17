import { faCloud } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

export interface FileInputForm {
  files: FileList;
}

export interface FileInputProps {
  label?: string;
  multiple?: boolean;
  onChange?(files: FileList): void;
}

export const FileInput: React.FC<FileInputProps> = ({
  label = "Upload",
  multiple,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onChange?.(event.target.files);
    }
  };

  return (
    <form>
      <label
        className="flex px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out"
        style={{ fontFamily: "Press Start\\ 2P", fontSize: 9 }}
      >
        <div className="mx-auto">
          <FontAwesomeIcon icon={faCloud} className="mr-4 h-4" />
          <span style={{ fontFamily: "Press Start\\ 2P", fontSize: 9 }}>
            {label}
          </span>
        </div>
        <input
          type="file"
          ref={inputRef}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </form>
  );
};
