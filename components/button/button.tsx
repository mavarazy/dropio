import {
  faArrowRotateRight,
  IconLookup,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { classNames } from "../../utils/class-names";

interface ButtonProps {
  text?: string;
  icon?: IconLookup;
  children?: JSX.Element;
  onClick(): Promise<any>;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  text,
  children,
  onClick,
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={classNames(
        loading
          ? "bg-indigo-50 text-indigo-600 translate-y-1"
          : "bg-indigo-600 text-white",
        "flex px-2 py-2 rounded-full shadow-lg uppercase cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out"
      )}
      onClick={handleClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={loading ? faArrowRotateRight : icon}
          className={classNames(text ? "mx-2" : "", "h-4 w-4")}
          spin={loading}
        />
      )}
      {text && (
        <span
          className={classNames(icon ? "mr-2" : "mx-2", "text-xs font-bold")}
        >
          {text}
        </span>
      )}
      {children}
    </button>
  );
};
