import { useRef, useState } from "react";
import { CrossIcon } from "../icons/cross"
import { Button } from "./button"; 
import { Input } from "./input"; 
import { BACKEND_URL } from "../config"; 
import axios from "axios";


enum ContentType {
    youtube = "youtube",
    twitter = "twitter",
    instagram = "instagram",
    link = "link"
}

interface CreateContentModalProps {
    open: boolean; 
    onClose: () => void; 
}


export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.youtube);


    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value; 
        await axios.post(`${BACKEND_URL}/content`, {
            link,
            title,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token") || "" 
            }
        });
        onClose();
    }
    return (
        <div>
            {open && (
                <div>
                    <div className="w-screen h-screen bg-gray-800 fixed top-0 left-0 opacity-60 flex justify-center"></div>
                    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                        <div className="flex flex-col justify-center">
                            <span className="bg-black opacity-100 p-4 rounded fixed">
                                <div className="flex justify-end">
                                    <div onClick={onClose} className="cursor-pointer">
                                        <CrossIcon />
                                    </div>
                                </div>
                                <div>
                                    <Input reference={titleRef} placeholder="Title" />
                                    <Input reference={linkRef} placeholder="Link" />
                                </div>
                                <div>
                                    <h1>Type</h1>
                                    <div className="flex gap-1 justify-center pb-2">
                                        <Button
                                            text="youtube"
                                            variant={type === ContentType.youtube ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.youtube)}
                                        />
                                        <Button
                                            text="twitter"
                                            variant={type === ContentType.twitter ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.twitter)}
                                        />
                                        <Button
                                            text="instagram"
                                            variant={type === ContentType.instagram ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.instagram)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Button onClick={addContent} variant="primary" text="Submit" />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}