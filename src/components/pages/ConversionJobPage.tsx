import UploadArea from "../conversion/UploadArea.tsx";
import {useState, useEffect, useRef} from "react";
import ImageToolbar from "../conversion/ImageToolbar.tsx";
import ImageDisplay from "../conversion/ImageDisplay.tsx";
import type {Prompt} from '@/schemas/prompts.ts'
import {getPrompts} from "@/services/api.prompts.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import type {ReactCropperElement} from 'react-cropper';
import {useParams,useNavigate} from "react-router-dom";
import {deleteConversionJob, uploadImage, getConversionJob} from "@/services/api.jobs.ts";
import {Backdrop, CircularProgress} from "@mui/material";
import type {Coordinate} from "@/types.ts";
import OcrResult from "@/components/conversion/OcrResult.tsx";
import {useAlert} from "@/hooks/useAlert";
import {AlertDisplay} from "@/components/ui/AlertDisplay";

/**
 * Page for creating new OCR job or editing existing job.
 * Handles image upload, cropping, OCR processing, and coordinate editing
 * Uses: UploadArea, ImageToolbar, ImageDisplay, OcrResult
 */

const ConversionJobPage = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const [image, setImage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');

    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);

    const [isCropping, setIsCropping] = useState(false);

    const cropperRef = useRef<ReactCropperElement>(null);

    const {projectId, jobId} = useParams<{ projectId: string; jobId?: string }>();
    const [isUploading, setIsUploading] = useState(false);

    const [uploadedCoordinates, setUploadedCoordinates] = useState<Coordinate[]>([]);
    const [uploadedJobId, setUploadedJobId] = useState<number | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string>('');

    const isEdit = Boolean(jobId);
    const navigate = useNavigate();
    const { success, error, showSuccess, showError, clear } = useAlert();

    useEffect(() => {
        getPrompts()
            .then((data) => {
                setPrompts(data);

                const prevPromptId = localStorage.getItem("lastPromptId");
                if (prevPromptId && data.some(p => p.id === Number(prevPromptId))) {
                    setSelectedPromptId(Number(prevPromptId));
                } else if (data.length > 0) {
                    setSelectedPromptId(data[0].id);
                }
            })
        .catch((err) => {
            console.error("Error loading prompts:", err);
            showError(getErrorMessage(err));
        });
        },[showError]);

    useEffect(() => {
        return () => {
            if (image && image.startsWith("blob:"))
            URL.revokeObjectURL(image);
        };
    }, [image]);

    useEffect(() => {
        if (isEdit && projectId && jobId) {
            const loadJob = async () => {
                try {
                    setIsUploading(true);
                    const job = await getConversionJob(Number(projectId), Number(jobId));

                    const imagePath = `${import.meta.env.VITE_API_BASE}/storage/images/Project_${projectId}/original/${job.originalFileName}`;

                    setImage(imagePath);
                    setShowToolbar(true);

                    setUploadedCoordinates(job.coordinates || []);
                    setUploadedJobId(job.id);
                    setSelectedPromptId(job.promptId);
                    setOriginalFileName(job.originalFileName);

                } catch (err) {
                    console.error('Error loading job:', err);
                    showError(getErrorMessage(err));
                } finally {
                    setIsUploading(false);
                }
            };
            void loadJob();
        }
    }, [isEdit, projectId, jobId, showError]);

    const handleFileChange = (file: File) => {
        setImage(URL.createObjectURL(file));
        setFileName(file.name);
        setShowToolbar(true);
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
        setUploadedJobId(null);
        navigate(`/projects/${projectId}/conversion-jobs/new`);
    }

    const handleBackToMap = () => {
        navigate(`/projects/${projectId}/conversion-jobs`);
    };


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
            cropper.clear();
            cropper.setDragMode('move');
        }
    };

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

    const handleUpload = async()=>{
        try{
            if (selectedPromptId === null){
                showError("Παρακαλούμε επιλέξτε το κατάλληλο Prompt από την προτεινόμενη λίστα")
            }
            if (!projectId){
                showError("Δεν βρέθηκε επιλεγμένο projectId")
            }

            setIsUploading(true);
            const blob = await getCropperBlob();

            if (!blob){
                showError("Δεν βρέθηκε ο αποκομμένος πίνακας συντεταγμένων προς αποστολή")
                setIsUploading(false);
                return;
            }

            const result = await uploadImage({
                imageFile: blob,
                projectId: Number(projectId),
                promptId: selectedPromptId!,
                fileName: fileName
            });

            if (result.status === 'Failed') {
                setIsUploading(false);
                showError(`OCR Failed: ${result.errorMessage || 'Unknown error'}`);
                return;
            }

            if (!result.coordinates || result.coordinates.length === 0) {
                setIsUploading(false);
                showError('Δεν βρέθηκαν συντεταγμένες στην εικόνα');
                return;
            }

            setUploadedJobId(result.id);
            setOriginalFileName(result.originalFileName);
            setUploadedCoordinates(result.coordinates);
            setIsUploading(false);
            showSuccess(`Επιτυχής επεξεργασία! Βρέθηκαν ${result.coordinates.length} σημεία`);
            handleCancelCrop();

            console.log("OCR Result:", result);

        } catch (err){
            console.error ("Upload error:", err)
            showError(getErrorMessage(err))
            setIsUploading(false);
            handleCancelCrop();
            handleReset();
        }
    };

    const handleDelete=async ()=>{
        if(!uploadedJobId) return;
        if (!confirm('Θέλετε να διαγράψετε την μετατροπή συντεταγμένων;')){
            return;
        }
        try {
            await deleteConversionJob(Number(projectId),uploadedJobId);
            showSuccess('Η εργασία διαγράφηκε επιτυχώς');

            if (isEdit) {
                navigate(`/projects/${projectId}/conversion-jobs`);
            }else {
                setUploadedCoordinates([]);
                setUploadedJobId(null);
            }

        } catch (err) {
            console.error('Error deleting conversion job:', err);
            showError(getErrorMessage(err));
        }
    };


    return (
        <>
        <div className="w-full">
            <AlertDisplay success={success} error={error} onClose={clear} />

            {!showToolbar && !isEdit && (
                <UploadArea
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) {
                            handleFileChange(files[0])
                        }
                    }}
                    onFileChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            handleFileChange(files[0])
                        }
                    }}
                    isDragging={isDragging}
                    onBackToMap={handleBackToMap}
                />
            )}

            {showToolbar && (
                <div className={`grid gap-6 ${uploadedCoordinates.length > 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
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
                            onBackToMap={handleBackToMap}
                            isEdit={isEdit}
                        />
                        <ImageDisplay
                            src={image}
                            cropperRef={cropperRef}
                            dragMode={isCropping ? 'crop' : 'move'}
                        />
                    </div>

                    {uploadedCoordinates.length > 0 && (
                        <div>
                            <OcrResult initialCoordinates={uploadedCoordinates}
                            jobId={uploadedJobId!}
                            originalFileName={originalFileName}
                            projectId={Number(projectId)}
                            onDelete={handleDelete}/>
                        </div>
                    )}
                </div>
            )}
        </div>

            <Backdrop sx={{
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: 'blur(2px)',
            }}
                      open={isUploading}>

                <CircularProgress size={50}/>

            </Backdrop>

        </>
    )}
export default ConversionJobPage;