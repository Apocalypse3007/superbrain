// Sidebar.tsx
import { InstagramIcon } from "../icons/instagram";
import { TwitterIcon } from "../icons/twitter";
import { YoutubeIcon } from "../icons/youtube";
import { Linkicon } from "../icons/link";
import { SidebarItem } from "./sidebaritem";

type SidebarProps = {
    selectedType: "twitter" | "youtube" | "instagram" | "link" | null;
    setSelectedType: (type: "twitter" | "youtube" | "instagram" | "link" | null) => void;
};

export function Sidebar({ selectedType, setSelectedType }: SidebarProps) {
    return (
        <div className="h-screen bg-gray-800 border-r w-72 fixed left-0 top-0 pl-6">
            <div className="flex text-2xl pt-8 items-center">
                <div className="pr-2 text-gray-200 font-serif font-semibold">
                    Second-Brain
                </div>
            </div>
            <div className="pt-8 pl-4">
                <SidebarItem
                    text="All"
                    icon={null}
                    onClick={() => setSelectedType(null)}
                    active={selectedType === null}
                />
                <SidebarItem
                    text="Twitter"
                    icon={<TwitterIcon />}
                    onClick={() => setSelectedType("twitter")}
                    active={selectedType === "twitter"}
                />
                <SidebarItem
                    text="Youtube"
                    icon={<YoutubeIcon />}
                    onClick={() => setSelectedType("youtube")}
                    active={selectedType === "youtube"}
                />
                <SidebarItem
                    text="Instagram"
                    icon={<InstagramIcon />}
                    onClick={() => setSelectedType("instagram")}
                    active={selectedType === "instagram"}
                />
                <SidebarItem
                    text="Link"
                    icon={<Linkicon />}
                    onClick={() => setSelectedType("link")}
                    active={selectedType === "link"}
                />
            </div>
        </div>
    );
}