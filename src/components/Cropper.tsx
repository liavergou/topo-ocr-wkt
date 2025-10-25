import UploadArea from "./pages/UploadArea.tsx";
import {useState} from "react";

const Cropper = () => {

    const [isDragging, setIsDragging] = useState(false);
    return (
        <>
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Test UploadArea</h1>
            {/*ΠΡΟΣΩΡΙΝΑ*/}
            <UploadArea
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}

                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}

                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    console.log('Files:', e.dataTransfer.files);
                }}

                onFileChange={(e) => console.log('Selected:', e.target.files)}

                isDragging={isDragging}
            />
        </div>
        </>
)}
export default Cropper;