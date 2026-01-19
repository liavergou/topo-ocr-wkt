import 'cropperjs/dist/cropper.css';
import {Cropper} from 'react-cropper';
import type {ImageDisplayProps} from "@/types.ts";

/**
 * Displays image with cropping functionality using react-cropper
 * Used in: ConversionJobPage
 */

const ImageDisplay = ({src, cropperRef,dragMode}: ImageDisplayProps) => {


    return (
        <>
            <div className= "w-full h-[70vh] bg-gray-100 rounded overflow-hidden">
                <Cropper
                    ref={cropperRef}
                    src={src}
                    style={{height: '100%', width: '100%'}}
                    viewMode={1}
                    dragMode={dragMode}
                    autoCrop={false}
                    zoomable={true}
                    rotatable={true}
                    zoomOnWheel={true}
                    cropBoxMovable={true}
                    cropBoxResizable={true}
                    background={false}
                />
            </div>

        </>
    );
};
export default ImageDisplay;