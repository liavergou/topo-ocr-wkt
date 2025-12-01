import UploadArea from "./pages/UploadArea.tsx";
import {useState, useEffect} from "react";
import ImageToolbar from "./pages/ImageToolbar.tsx";
import type {Prompt} from '@/schemas/prompts.ts'
import {getPrompts} from "@/services/api.prompts.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";


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

    const [prompts, setPrompts] = useState<Prompt[]>([]); //τα prompts από το api
    const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null); //το id του selected


    useEffect(() => {
        getPrompts()
            .then((data) => {
                setPrompts(data);

                const prevPromptId = localStorage.getItem("lastPromptId");
                if (prevPromptId && data.some(p=> p.id === Number(prevPromptId))) //αν υπάρχει τιμή στο local storage και είναι ακόμα υπαρκτή, προσοχη ειναι text να γινει Number
                {
                    setSelectedPromptId(Number(prevPromptId));
                } else if (data.length > 0) {
                    setSelectedPromptId(data[0].id);
                }
            })
        .catch((err) => {
            console.error("Error loading prompts:", err);
            alert(getErrorMessage(err));
        });
        },[]);

    const handlePromptChange = (promptId:number)=>
    {
        setSelectedPromptId(promptId);
        localStorage.setItem("lastPromptId", String(promptId));
    }

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
                    <ImageToolbar
                        prompts={prompts}
                        selectedPromptId={selectedPromptId}
                        onPromptChange={handlePromptChange}/>
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