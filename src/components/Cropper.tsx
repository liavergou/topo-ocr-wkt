import UploadArea from "./pages/UploadArea.tsx";
import {useState, useEffect, useRef} from "react";
import ImageToolbar from "./pages/ImageToolbar.tsx";
import ImageDisplay from "./pages/ImageDisplay.tsx";
import type {Prompt} from '@/schemas/prompts.ts'
import {getPrompts} from "@/services/api.prompts.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import type {ReactCropperElement} from 'react-cropper';



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

    const [isCropping, setIsCropping] = useState(false); //οταν crop mode true αλλιως false

    const cropperRef = useRef<ReactCropperElement>(null);

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

    //memory management προσοχη - https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob ****To release an object URL, call revokeObjectURL().
    useEffect(() => {
        return () => {
            if (image && image.startsWith("blob:")) //react dev tools στο hooks στο Cropper component είναι "blob:http://localhost:5173/147bfe22-9e8e-4063-93e5-3a0fa9c7dfea"
            URL.revokeObjectURL(image);
        };
    }, [image]);




    const handleFileChange = (file: File) => {
        setImage(URL.createObjectURL(file)); //αποθηκευω στη μνήμη το url του αρχείου https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
        setFileName(file.name);
        setShowToolbar(true); //για να ενεργοποιήσει το conditional rendering για την εμφάνιση της εικόνας
    }


    const handlePromptChange = (promptId:number)=>
    {
        setSelectedPromptId(promptId);
        localStorage.setItem("lastPromptId", String(promptId));
    }

    const handleClearAll = ()=>{
        setImage('');
        setShowToolbar(false);
        setFileName('');
    }


    // const handleZoomIn = ()=> cropperRef.current?.cropper?.zoom(0.1);
    // const handleZoomOut =()=> cropperRef.current?.cropper?.zoom(-0.1);
    const handleRotateLeft =()=> cropperRef.current?.cropper?.rotate(-90);
    const handleRotateRight =()=> cropperRef.current?.cropper?.rotate(90);

    const handleReset =()=> {
        cropperRef.current?.cropper?.reset();
        setIsCropping(false);
    }

    const handleStartCrop =()=> {
        setIsCropping(true);
        cropperRef.current?.cropper?.setDragMode('crop');
    }

    const handleCancelCrop =()=> {
        setIsCropping(false);
        const cropper = cropperRef.current?.cropper;
        if (cropper){
            cropper.clear(); //αφαιρεί το selection box
            cropper.setDragMode('move'); //ξαναπάει σε move mode
        }

    };


    return (
        <>
        <div className="w-full">
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
                        onPromptChange={handlePromptChange}
                        onClearAll={handleClearAll}
                        // onZoomIn={handleZoomIn}
                        // onZoomOut={handleZoomOut}
                        onRotateLeft={handleRotateLeft}
                        onRotateRight={handleRotateRight}
                        onReset={handleReset}
                        onStartCrop={handleStartCrop}
                        onCancelCrop={handleCancelCrop}
                        isCropping={isCropping}
                        // onCropAndUpload={handleCropAndUpload}
                    />
                    {/*<div className="max-w-full max-h-[60vh] object-contain mx-auto">*/}
                    {/*    <img*/}
                    {/*    src={image}*/}
                    {/*    alt={fileName}/>*/}
                    {/*</div>*/}
                    <ImageDisplay
                        src={image}
                        cropperRef={cropperRef}
                        dragMode={isCropping?'crop':'move'}/>
                </div>
            )}
        </div>
        </>
    )}
export default Cropper;