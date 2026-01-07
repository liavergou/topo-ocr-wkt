
// https://react-cropper.github.io/react-cropper/
// https://github.com/fengyuanchen/cropperjs/blob/75cabcfde48be35cc2ab5962f7a6f5aa360fe289/docs/migration.md?plain=1#L22
//https://www.jsdocs.io/package/react-cropper#ReactCropperElement
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
                    ref={cropperRef} // react ref για προσβαση στο cropper instance χωρίς να κάνει rerender
                    src = {src} //Blob url από URL.createObjectURL() στο cropper.tsx
                    style={{height: '100%',width:'100%' }} //css για full width height
                    viewMode={1} //για να μη βγει το canvas εκτός container
                    dragMode={dragMode}
                    autoCrop={false} //όχι αυτόματο crop box
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