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
            //conditional για αλλαγη χρώματος στο drag πανω απο το element

            onDragOver={onDragOver}    // Ενεργοποιείται όταν σύρουμε πάνω από το area
            onDragLeave={onDragLeave}  // Ενεργοποιείται όταν φεύγουμε από το area
            onDrop={onDrop}            // Ενεργοποιείται όταν αφήνουμε το αρχείο

        >

            <div className="text-center">
                <p className="mt-2 mb-5 text-gray-500 font-semibold text-2xl">
                    Drag & Drop ή
                </p>
                <label htmlFor="file-upload"
                       className="px-3 py-3 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-500  text-2xl font-semibold text-white shadow-sm ">
                    Επιλέξτε αρχείο..
                </label>

                <input
                    id="file-upload"
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