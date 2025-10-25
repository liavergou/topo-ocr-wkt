import UploadArea from "./pages/UploadArea.tsx";
import {useState} from "react";
import ImageToolbar from "./pages/ImageToolbar.tsx";

const Cropper = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);

    return (
        <>
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Test UploadArea</h1>

            {/*conditional rendering*/}
            {!showToolbar && (
                <UploadArea
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}

                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}

                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        setShowToolbar(true);
                        console.log('Files:', e.dataTransfer.files);
                    }}

                    onFileChange={(e) => {
                        setShowToolbar(true);
                        console.log('Selected:', e.target.files)
                    }}
                    isDragging={isDragging}
                />
            )}

            {showToolbar && (
                <div className="mt-8">
                    <ImageToolbar />
                </div>
            )}
        </div>
        </>
)}
export default Cropper;