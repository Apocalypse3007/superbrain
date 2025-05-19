
import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullwidth?: boolean;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-transparent text-gray-100 border border-gray-500 hover:bg-gray-900 hover:text-white hover:outline hover:outline-white hover:outline-1 hover:shadow-[0_0_10px_white]",
    "secondary": "bg-transparent text-gray-400 border border-gray-600 hover:bg-gray-800 hover:text-white hover:outline hover:outline-white hover:outline-1 hover:shadow-[0_0_10px_white]"
};

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";


export function Button({ variant, text, startIcon, onClick, fullwidth, loading }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={
                variantClasses[variant] +
                " " +
                defaultStyles +
                `${fullwidth ? " w-full flex justify-center items-center" : ""} ${loading ? "opacity-45" : ""}`
            }
            disabled={loading}
        >
            {startIcon && <div className="pr-2">{startIcon}</div>}
            {text}
        </button>
    );
}