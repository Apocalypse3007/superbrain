import { useRef } from "react";
import { Button } from "../components/button"; 
import { Input } from "../components/input"; 
import { BACKEND_URL } from "../config"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 


export function Signin() {
    const emailRef = useRef<HTMLInputElement>(null); 
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    async function signin() {
        const email = emailRef.current?.value;
        console.log(emailRef.current); 
        const password = passwordRef.current?.value; 
        const response = await axios.post(BACKEND_URL + "/signin", {
            email,
            password 
        });
        const jwt = response.data.token;
        localStorage.setItem("token", jwt);

        navigate("/dashboard");
    }

    return (
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-8">
                <Input reference={emailRef} placeholder="Username" />
                <Input reference={passwordRef} placeholder="Password" />
                <div className="flex justify-center pt-4">
                    <Button onClick={signin} loading={false} variant="primary" text="Signin" fullwidth={true} />
                </div>
            </div>
        </div>
    );
}