import UploadArea from "./UploadArea.tsx";
import {useState} from "react";

const Cropper = () => {

    const [isDragging, setIsDragging] = useState(false);
    return (
        <>

            <div className="p-8">
                <h1>Test UploadArea</h1>
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