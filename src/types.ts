import * as React from "react";
import type {UserRole} from "@/schemas/users.ts";
import type {Prompt} from "@/schemas/prompts.ts";
import type {ReactCropperElement} from 'react-cropper';

//Dashboard component
export type MenuItemProps = {
    label: string;
    path: string;
    icon: React.ReactNode;
};

//UploadArea component
//https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
export type UploadAreaProps = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDragging: boolean;
    onBackToMap: () => void;
};

//useAuth component
//η πληροφορία απο token extracted
export type UserInfoProps = {
    keycloakId?: string;
    username?: string;
    email?: string;
    lastname?: string;
    firstname?: string;
    name?: string;
    role?: string;
    }
//ProtectedRoute component
// roles για το protected route Admin,Manager μαζί ["Admin","Manager"]
export type ProtectedRouteProps = {
    roles?: UserRole[]
};

//UsersPage component
// User type (για display μόνο - από UserReadOnlyDTO backend)
export type User = {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
};

//ProjectCard component
//Project type για τα Project Card
export type ProjectCardProps={
    id: number;
    projectName: string;
    onClick?:()=>void;
}

//api.users.ts (getUserProjects, updateUserProjects)
//UserProjects για assign project σε χρήστη
export type UserProjects ={
    projectIds: number[];
}

//ImageToolbar component
export type ImageToolbarProps = {
    // onZoomIn: () => void;
    // onZoomOut: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onReset: () => void;
    onClearAll: () => void;
    onStartCrop: () => void;
    onCancelCrop: () => void;
    isCropping: boolean;
    prompts: Prompt[];
    selectedPromptId: number | null;
    onPromptChange: (promptId: number) =>void;
    onUpload: () => void;
    onBackToMap: () => void;
    isEdit: boolean;
}

//ImageDisplay component
//Το react-cropper αποθηκευει το ConversionJobPage.js instance στο ReactCropperElement.cropper. cropperRef.current?.cropper?.rotate()
//https://www.jsdocs.io/package/react-cropper#Cropper
//https://github.com/react-cropper/react-cropper
export type ImageDisplayProps = {
    src: string; //blob url από URL.createObjectURL() στο cropper.tsx
    cropperRef: React.RefObject<ReactCropperElement | null>; //ref για προσβαση στο cropper instance χωρίς να κάνει rerender
    dragMode: 'move' | 'crop';
}

// api.jobs.ts (uploadImage function)
//REQUEST
export type UploadJobRequest ={
    imageFile: Blob;
    projectId: number;
    promptId: number;
    fileName?: string;
}

//api.jobs.ts (response from uploadImage, getConversionJob)
//RESPONSE
export type UploadJobResponse={
    id: number;
    originalFileName: string;
    croppedFileName: string;
    modelUsed?: string;
    status: JobStatus; //καλύτερα
    errorMessage: string;
    coordinates?: Coordinate[];
    projectId: number,
    promptId: number,
    deletedAt?: string | null;
}

export type Coordinate = {
    order: number;
    x: number;
    y: number;

}
//για ελεγχο του status του response
export type JobStatus = 'Processing'|'Completed'|'Failed';

//props του OCR Result
export type CoordinatesResultProps = {
    jobId:number;
    projectId: number;
    initialCoordinates: Coordinate[];
    originalFileName: string;
    onDelete?: () => void;
};

//Props του πινακα συντεταγμένων
export type CoordinatesTableProps={
    coordinates: Coordinate[];
    onChange:(updated:Coordinate[]) => void;
}

//api.jobs.ts (updateConversionJob function)
export type ConversionJobUpdate = {
    coordinates:Coordinate[];
}

// Props του MapPreview
export type MapPreviewProps = {
    coordinates: Coordinate[];
    area: number;
};

//ConversionJobs component
//Props του JobData από τον geoserver
export type JobDataProps = {
    id: string;
    JobId?: number;
    OriginalFile?: string;
    CroppedFile?: string;
    GenAIModel?: string;
    PromptName?: string;
    UserId?: number;
    Username?: string;
    JobStatus?: string;
    ProjectId?: number;
    ProjectName?: string;
    Area?: number;
    DeletedAt?: string | null;
}

// Props για το AlertDisplay
export type AlertDisplayProps = {
    success?: string;
    error?: string;
    onClose: () => void;
};