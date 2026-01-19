import type { UploadAreaProps } from '@/types.ts';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';

/**
 * Drag-and-drop file upload area for images (jpg,png)
 * Used in: ConversionJobPage
 */
const UploadArea = ({
                        onDragOver
                        , onDragLeave
                        , onDrop
                        ,onFileChange
                        , isDragging
                        , onBackToMap
                    }: UploadAreaProps) => {
    return (

        <div
            className={`relative flex items-center justify-center border-8 border-dashed rounded-xl p-8 min-h-[400px] mt-20
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-700 bg-gray-100'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="absolute top-4 right-4">
                <Button
                    onClick={onBackToMap}
                    variant="text"
                    color="primary"
                    size="medium"
                    startIcon={<MapIcon />}
                    sx={{ color: 'gray' }}
                >
                    ΕΠΙΣΤΡΟΦΗ
                </Button>
            </div>

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
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default UploadArea;