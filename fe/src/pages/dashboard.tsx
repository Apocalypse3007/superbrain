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

// Dashboard component that renders the main page
export function Dashboard() {
  // State to manage the modal visibility
  const [modalOpen, setModalOpen] = useState(false);
  // Custom hook to fetch content and refresh the content list
  const {contents, refresh} = useContent();

  // useEffect hook to refresh the content whenever the modalOpen state changes
  useEffect(() => {
    refresh();
  }, [modalOpen])

  return (
    <div>
      <Sidebar /> {/* Sidebar component for navigation */}
      
      <div className="p-4 ml-72 min-h-screen bg-black border-2">
        {/* CreateContentModal component for adding new content, controlled by modalOpen state */}
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
        
        <div className="flex justify-end gap-4">
          {/* Button to open the 'Create Content' modal */}
          <Button onClick={() => setModalOpen(true)} variant="primary" text="Add content" startIcon={<PlusIcon />} />
          
          {/* Button to share the brain content */}
          <Button onClick={async () => {
              // Making a POST request to share the brain content
              const response = await axios.post(`${BACKEND_URL}/brain/share`, {
                  share: true
              }, {
                  headers: {
                      "Authorization": localStorage.getItem("token") // Passing the authorization token in the request header
                  }
              });
              // Constructing the share URL and alerting the user with the link
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
          }} variant="secondary" text="Share brain" startIcon={<ShareIcon />} />
        </div>

        <div className="flex gap-4 flex-wrap">
          {contents.map(({type, link, title}) => (
            <Card 
                type={type} 
                link={link} 
                title={title} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}