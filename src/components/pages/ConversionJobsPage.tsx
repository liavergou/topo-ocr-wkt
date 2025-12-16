import UploadArea from "../conversion/UploadArea.tsx";
import {useState, useEffect, useRef} from "react";
import ImageToolbar from "../conversion/ImageToolbar.tsx";
import ImageDisplay from "../conversion/ImageDisplay.tsx";
import type {Prompt} from '@/schemas/prompts.ts'
import {getPrompts} from "@/services/api.prompts.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import type {ReactCropperElement} from 'react-cropper';
import {useParams} from "react-router-dom";
import {uploadImage} from "@/services/api.jobs.ts";
import {Backdrop, CircularProgress} from "@mui/material";
import type {Coordinate} from "@/types.ts";
import OcrResult from "@/components/conversion/OcrResult.tsx";

// import * as pdfjsLib from 'pdfjs-dist';
// Το PDF.js χρησιμοποιεί έναν "Web Worker" για να μην "παγώνει" το UI κατά την επεξεργασία.
//είναι στα Modules.
//https://www.youtube.com/watch?v=zbL2Z4ZhLlo STATES και για multipage

const ConversionJobsPage = () => {

    //****STATE MANAGEMENT*****
    const [isDragging, setIsDragging] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const [image, setImage] = useState<string>(''); //για να κρατήσει το url της εικόνας που εχει ανέβει
    const [fileName, setFileName] = useState<string>(''); //αρχικό

    const [prompts, setPrompts] = useState<Prompt[]>([]); //τα prompts από το api
    const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null); //το id του selected

    const [isCropping, setIsCropping] = useState(false); //οταν crop mode true αλλιως false

    const cropperRef = useRef<ReactCropperElement>(null);

    const {projectId} = useParams(); //πιάνουμε το projectId απο το url
    const [isUploading, setIsUploading] = useState(false); //για mui elements. Backdrop https://mui.com/material-ui/react-backdrop/ The Backdrop component narrows the user's focus to a particular element on the screen.

    const [uploadedCoordinates, setUploadedCoordinates] = useState<Coordinate[]>([]);
    const [uploadedJobId, setUploadedJobId] = useState<number | null>(null);

    useEffect(() => {
        getPrompts()
            .then((data) => {
                setPrompts(data);

                const prevPromptId = localStorage.getItem("lastPromptId");
                if (prevPromptId && data.some(p => p.id === Number(prevPromptId))) //αν υπάρχει τιμή στο local storage και είναι ακόμα υπαρκτή, προσοχη ειναι text να γινει Number
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
            if (image && image.startsWith("blob:")) //react dev tools στο hooks στο ConversionJobsPage component είναι "blob:http://localhost:5173/147bfe22-9e8e-4063-93e5-3a0fa9c7dfea"
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
        setUploadedCoordinates([]);
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

    //εχω το cropper instance, καλώ το getCroppedCanvas ->μετατροπή σε Blob canvas.toBlob
    const getCropperBlob = (): Promise<Blob | null>=>{
        return new Promise((resolve) => {
            const cropper = cropperRef.current?.cropper;
            if(!cropper){
                resolve(null);
                return;
            }

            const canvas = cropper.getCroppedCanvas();
            if (!canvas){
                resolve(null);
                return;
            }
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg',0.9);
        });
    };

    //UPLOAD IMAGE HANDLER******
    const handleUpload = async()=>{
        try{
            //έλεγχος promptId
            if (selectedPromptId === null){
                alert("Παρακαλούμε επιλέξτε το κατάλληλο Prompt από την προτεινόμενη λίστα")
            }
            //ελεγχος projectId
            if (!projectId){
                alert("Δεν βρέθηκε επιλεγμένο projectId")
            }

            //getCroppedBlob
            setIsUploading(true);
            const blob = await getCropperBlob();

            //ελεγχος blob
            if (!blob){
                alert("Δεν βρέθηκε ο αποκομμένος πίνακας συντεταγμένων προς αποστολή")
                setIsUploading(false);
                return;
            }

            //UPLOAD
            const result = await uploadImage({
                imageFile: blob,
                projectId: Number(projectId),
                promptId: selectedPromptId!, //αναγκαστικά ! γιατι εχω κανει ήδη ελεγχο για null
                fileName: fileName
            });

            if (result.status === 'Failed') {
                setIsUploading(false);
                alert(`OCR Failed: ${result.errorMessage || 'Unknown error'}`);
                return;
            }

            if (!result.coordinates || result.coordinates.length === 0) {
                setIsUploading(false);
                alert('Δεν βρέθηκαν συντεταγμένες στην εικόνα');
                return;
            }

            setUploadedJobId(result.id);
            setUploadedCoordinates(result.coordinates);
            setIsUploading(false);
            alert(`Επιτυχής επεξεργασία! Βρέθηκαν ${result.coordinates.length} σημεία`);
            handleCancelCrop();
            // handleReset();

            console.log("OCR Result:", result); //προσωρινα

        } catch (err){
            console.error ("Upload error:", err)
            alert(getErrorMessage(err))
            setIsUploading(false);
            handleCancelCrop();
            handleReset();
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
                <div className={`grid gap-6 ${uploadedCoordinates.length > 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Left Column - Image Display */}
                    <div className="space-y-4">
                        <ImageToolbar
                            prompts={prompts}
                            selectedPromptId={selectedPromptId}
                            onPromptChange={handlePromptChange}
                            onClearAll={handleClearAll}
                            onRotateLeft={handleRotateLeft}
                            onRotateRight={handleRotateRight}
                            onReset={handleReset}
                            onStartCrop={handleStartCrop}
                            onCancelCrop={handleCancelCrop}
                            isCropping={isCropping}
                            onUpload={handleUpload}
                        />
                        <ImageDisplay
                            src={image}
                            cropperRef={cropperRef}
                            dragMode={isCropping ? 'crop' : 'move'}
                        />
                    </div>

                    {/* Right Column - OCR Results (conditional) */}
                    {uploadedCoordinates.length > 0 && (
                        <div>
                            <OcrResult initialCoordinates={uploadedCoordinates}
                            jobId={uploadedJobId!}/>
                            {/*! για το null*/}
                        </div>
                    )}
                </div>
            )}
        </div>


            {/*https://api.reactrouter.com/v7/functions/react_router.useLocation.html*/}
            <Backdrop sx={{
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: 'blur(2px)', // Adds a blur effect
            }}
                      open={isUploading}>

                <CircularProgress size={50}/>

            </Backdrop>

        </>
    )}
export default ConversionJobsPage;