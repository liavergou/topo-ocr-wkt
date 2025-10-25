import type { UploadAreaProps } from '../../types';
//https://claritydev.net/blog/react-typescript-drag-drop-file-upload-guide
//https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file


const UploadArea = ({
                        onDragOver
                        , onDragLeave
                        , onDrop
                        ,onFileChange
                        , isDragging
                    }: UploadAreaProps) => {
    return (

        <div
            className={`flex items-center justify-center border-8 border-dashed rounded-xl p-8 min-h-[400px]
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-700 bg-gray-100'}`}

            onDragOver={onDragOver}    // Ενεργοποιείται όταν σύρουμε πάνω από το area
            onDragLeave={onDragLeave}  // Ενεργοποιείται όταν φεύγουμε από το area
            onDrop={onDrop}            // Ενεργοποιείται όταν αφήνουμε το αρχείο
        >
            <div className="text-center">

                <label className="px-6 py-3 bg-slate-700 text-white">
                    {/*

                    */}
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={onFileChange}

                    />
                </label>
                <input
                    id="file-upload-dark"
                    type="file"
                    accept="image/*,application/pdf,image/tiff"
                    onChange={onFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default UploadArea;