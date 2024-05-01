"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css"

interface FileUploadError {
    status: boolean;
    error: string | Error;
}

interface fileUploadProps{
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
    setIsFileUploadFailed: (errorData: FileUploadError) => void;
}

export const FileUpload = ({ onChange, endpoint, value, setIsFileUploadFailed }: fileUploadProps) => {
    const fileType = value?.split(".").pop()

    if (value && fileType !== "pdf"){
        return(
            <div className="relative h-20 w-20 ">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                <button 
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                    title="delete"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    } 
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                setIsFileUploadFailed({status: false, error: ""})
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log(error);
                setIsFileUploadFailed({status: true, error: "File size must be less than 4MB"})
            }}
        
        />
    )   
} 