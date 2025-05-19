import { useEffect } from "react";
import { ShareIcon } from "../icons/share";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube" | "instagram" | "link";
}

export function Card({ title, link, type }: CardProps) {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    if (type === "twitter") {
      script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
    } else if (type === "instagram") {
      script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
    }

    if (script) {
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script as HTMLScriptElement);
      };
    }
  }, [link, type]);

  return (
    <div>
      <div className="p-4 bg-gray-900 rounded-md border-gray-600 border min-h-[5rem] w-fit min-w-[16rem] max-w-xl">
        <div className="flex justify-between">
          <div className="flex items-center text-md text-white truncate overflow-hidden whitespace-nowrap w-full">
            <div className="pr-2">
              <ShareIcon />
            </div>
            {title}
          </div>
        </div>

        <div className="pt-4">
          {type === "youtube" && (
            <iframe
              className="w-full aspect-video rounded-md"
              src={link
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "www.youtube.com/embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            <div className="max-h-72 overflow-y-auto hide-scrollbar">
              <blockquote className="twitter-tweet w-full">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}

          {type === "instagram" && (
            <blockquote
              className="instagram-media w-full"
              data-instgrm-permalink={link}
              data-instgrm-version="14"
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "0",
                width: "100%",
              }}
            ></blockquote>
          )}
        {type === "link" && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                <img
                src={`https://api.microlink.io/?url=${encodeURIComponent(link)}&screenshot=true&meta=false&embed=screenshot.url`}
                alt="link preview"
                className="rounded-md w-full h-48 object-cover"
                />
            </a>
            )}
        </div>
      </div>
    </div>
  );
}
