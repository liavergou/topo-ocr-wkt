import * as React from "react";
import type {UserRole} from "@/schemas/users.ts";


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