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
export type UploadAreaProps = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDragging: boolean;
    onBackToMap: () => void;
};

//useAuth component
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
export type ProtectedRouteProps = {
    roles?: UserRole[]
};

//UsersPage component
export type User = {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
};

//ProjectCard component
export type ProjectCardProps={
    id: number;
    projectName: string;
    onClick?:()=>void;
}

//api.users.ts (getUserProjects, updateUserProjects)
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
export type ImageDisplayProps = {
    src: string; //blob url από URL.createObjectURL() στο cropper.tsx
    cropperRef: React.RefObject<ReactCropperElement | null>; //ref για προσβαση στο cropper instance χωρίς να κάνει rerender
    dragMode: 'move' | 'crop';
}

// api.jobs.ts
//REQUEST
export type UploadJobRequest ={
    imageFile: Blob;
    projectId: number;
    promptId: number;
    fileName?: string;
}

//api.jobs.ts
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

export type JobStatus = 'Processing'|'Completed'|'Failed';

//props του OCR Result
export type CoordinatesResultProps = {
    jobId:number;
    projectId: number;
    initialCoordinates: Coordinate[];
    originalFileName: string;
    onDelete?: () => void;
};

//CoordinatesTable Props
export type CoordinatesTableProps={
    coordinates: Coordinate[];
    onChange:(updated:Coordinate[]) => void;
}

//api.jobs.ts (updateConversionJob function)
export type ConversionJobUpdate = {
    coordinates:Coordinate[];
}

//MapPreview component
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

//AlertDisplay component
export type AlertDisplayProps = {
    success?: string;
    error?: string;
    onClose: () => void;
};