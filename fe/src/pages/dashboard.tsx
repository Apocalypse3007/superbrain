import { useEffect, useState } from "react" 
import { Button } from "../components/button" 
import { Card } from "../components/card" 
import { CreateContentModal } from "../components/createcontentmodel" 
import { PlusIcon } from "../icons/plus" 
import { ShareIcon } from "../icons/share" 
import { Sidebar } from "../components/sidebar" 
import { useContent } from "../hooks/usecontent" 
import { BACKEND_URL } from "../config"
import axios from "axios" 
import { AnimatePresence, motion } from "framer-motion";

type Content = {
  type: "twitter" | "youtube" | "instagram" | "link";
  link: string;
  title: string;
};
export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh } = useContent() as { contents: Content[]; refresh: () => void };
  const [selectedType, setSelectedType] = useState<"twitter" | "youtube" | "instagram" | "link" | null>(null);
  useEffect(() => {
    refresh();
  }, [modalOpen])
  
  const filteredContents = contents.filter((content: Content) => {
    if (selectedType === null) return true;
    return content.type === selectedType;
  })
  return (
    <div>
      <Sidebar selectedType={selectedType} setSelectedType={setSelectedType} />
      <div className="p-4 ml-72 min-h-screen bg-black border-2">
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
        
        <div className="flex justify-end gap-4">
          <Button onClick={() => setModalOpen(true)} variant="primary" text="Add content" startIcon={<PlusIcon />} />
          
          <Button onClick={async () => {
              const response = await axios.post(`${BACKEND_URL}/brain/share`, {
                  share: true
              }, {
                  headers: {
                      "Authorization": localStorage.getItem("token") 
                  }
              });
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
          }} variant="secondary" text="Share brain" startIcon={<ShareIcon />} />
        </div>
          <br></br>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex gap-4 flex-wrap">
              {filteredContents.map(({ type, link, title }) => (
                <Card
                  type={type}
                  link={link}
                  title={title}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
}