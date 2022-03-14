import { faArrowRotateRight } from "@fortawesome/pro-light-svg-icons";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { classNames } from "../../utils/class-names";

interface ButtonProps {
  icon?: IconDefinition;
  text?: string;
  className?: string;
  onClick(): Promise<any>;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  className,
  text,
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
        className
          ? className
          : "flex px-2 py-2 bg-indigo-600 text-white rounded-full shadow-lg uppercase cursor-pointer",
        "hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out mx-auto"
      )}
      onClick={handleClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={loading ? faArrowRotateRight : icon}
          className={text ? "mx-2" : ""}
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
    </button>
  );
};
