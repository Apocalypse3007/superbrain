import { useRef } from "react"; // Importing useRef to create references for the input fields
import { Button } from "../components/button"; 
import { Input } from "../components/input"; 
import axios from "axios"; 
import { BACKEND_URL } from "../config"; 
import { useNavigate } from "react-router-dom"; 


export function Signup() {
    const emailRef = useRef<HTMLInputElement>(null); 
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
        const email = emailRef.current?.value;
        console.log(emailRef.current); 
        const password = passwordRef.current?.value;
        const name = nameRef.current?.value;
        await axios.post(BACKEND_URL + "/signup", {
            email, 
            password,
            name
        });
        alert("You have signed up!");
        navigate("/signin");
    }

    return (
        <div className="h-screen w-screen bg-black flex justify-center items-center">
            <div className="bg-gray-800 rounded-xl border min-w-48 p-8 text-white">
                <Input reference={nameRef} placeholder="Name" />
                <Input reference={emailRef} placeholder="Username" />
                <Input reference={passwordRef} placeholder="Password" />

                {/* Submit button */}
                <div className="flex justify-center pt-4">
                    <Button onClick={signup} loading={false} variant="primary" text="Signup" fullwidth={true} />
                </div>
            </div>
        </div>
    );
}