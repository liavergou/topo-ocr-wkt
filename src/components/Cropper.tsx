import UploadArea from "./pages/UploadArea.tsx";
import {useState} from "react";
import ImageToolbar from "./pages/ImageToolbar.tsx";
// import * as pdfjsLib from 'pdfjs-dist';
// Το PDF.js χρησιμοποιεί έναν "Web Worker" για να μην "παγώνει" το UI κατά την επεξεργασία.
//είναι στα Modules.
//https://www.youtube.com/watch?v=zbL2Z4ZhLlo STATES και για multipage

const Cropper = () => {

    //****STATE MANAGEMENT*****
    const [isDragging, setIsDragging] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const [image, setImage] = useState<string>(''); //για να κρατήσει το url της εικόνας που εχει ανέβει
    const [fileName, setFileName] = useState<string>(''); //αρχικό

    const handleFileChange = (file: File) => {
        setImage(URL.createObjectURL(file)); //αποθηκευω στη μνήμη το url του αρχείου
        setFileName(file.name);
        setShowToolbar(true); //για να ενεργοποιήσει το conditional rendering για την εμφάνιση της εικόνας
    }



    return (
        <>
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Test UploadArea</h1>

            {/*conditional rendering*/}
            {!showToolbar && (
                <UploadArea
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}

                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}

                    //FileList που περιέχουν files
                    // για το drag n drop
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) {
                            handleFileChange(files[0])
                        }
                        // setShowToolbar(true);

                    }}
                    // για το file input
                    onFileChange={(e) => {
                        // e.preventDefault(); μονο για το drag. δεν χρειάζεται εδώ.
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            handleFileChange(files[0])
                        }

                    }}
                    isDragging={isDragging}
                />
            )}

            {showToolbar && (
                <div className="mt-8">
                    <ImageToolbar />
                    <div className="max-w-full max-h-[60vh] object-contain mx-auto">
                        <img
                        src={image}
                        alt={fileName}/>
                    </div>
                </div>
            )}
        </div>
        </>
)}
export default Cropper;