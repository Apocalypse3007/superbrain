import type { ReactElement } from "react"; 

export function SidebarItem({ text, icon, onClick, active }: {
    text: string;
    icon: ReactElement | null;
    onClick: () => void;
    active: boolean;
}) {
    return (
        <div 
            onClick={onClick} 
            className={`flex text-gray-700 py-2 cursor-pointer hover:bg-gray-900 rounded max-w-48 pl-4 transition-all duration-150 ${
                active ? 'bg-gray-700' : '' 
            }`}
        >
            <div className="pr-2">
                {icon}
            </div>
            <div className="text-white">
                {text}
            </div>
        </div>
    );
}