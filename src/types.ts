import * as React from "react";
import type {UserRole} from "@/schemas/users.ts";
import type {Prompt} from "@/schemas/prompts.ts";


export type MenuItemProps = {
    label: string;
    path: string;
    icon: React.ReactNode;
};

//https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
export type UploadAreaProps = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDragging: boolean;
};

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

// roles για το protected route Admin,Manager μαζί ["Admin","Manager"]
export type ProtectedRouteProps = {
    roles?: UserRole[]
};

// User type (για display μόνο - από UserReadOnlyDTO backend)
export type User = {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
};

//Project type για τα Project Card
export type ProjectCardProps={
    id: number;
    projectName: string;
    jobsCount: number;
    onClick?:()=>void;
}


//Props για το ImageToolbar component
export type ImageToolbarProps = {
    // onZoomIn: () => void;
    // onZoomOut: () => void;
    // onRotateLeft: () => void;
    // onRotateRight: () => void;
    // onReset: () => void;
    onClearAll: () => void;
    // onStartCrop: () => void;
    // onCancelCrop: () => void;
    // onCropAndUpload: () => void;
    // isCropping: boolean;
    prompts: Prompt[];
    selectedPromptId: number | null;
    onPromptChange: (promptId: number) =>void;
}