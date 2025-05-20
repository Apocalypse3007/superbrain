
interface InputProps { 
    placeholder: string;
    reference?: any 
}
export function Input({placeholder, reference}: InputProps) {
    return (
        <div>
            <input 
                ref={reference} 
                placeholder={placeholder}
                type={"text"} 
                className="px-4 py-2 border rounded m-2 bg-transparent text-gray-100 border border-gray-500"
            />
        </div>
    );
}