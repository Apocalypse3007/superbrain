import { InstagramIcon } from "../icons/instagram";
import { TwitterIcon } from "../icons/twitter";
import { YoutubeIcon } from "../icons/youtube";
import { Linkicon } from "../icons/link";
import { SidebarItem } from "./sidebaritem";

export function Sidebar() {
    return <div className="h-screen bg-gray-800 border-r w-72 fixed left-0 top-0 pl-6">
        <div className="flex text-2xl pt-8 items-center">
            <div className="pr-2 text-gray-200 font-serif font-semibold">
            Second-Brain
            </div>

        </div>
        <div className="pt-8 pl-4">
            <SidebarItem text="Twitter" icon={<TwitterIcon />} />
            <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
            <SidebarItem text="Instagram" icon={<InstagramIcon />} />
            <SidebarItem text="Link" icon={<Linkicon />} />

        </div>
    </div>
}