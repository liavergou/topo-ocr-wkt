import Button from '@mui/material/Button';
import {FormControl, IconButton, MenuItem, Select} from "@mui/material";
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import MapIcon from '@mui/icons-material/Map';
import type {ImageToolbarProps} from '@/types.ts';

/**
 * Toolbar for image manipulation and OCR processing. Provides image rotation, crop mode toggle, prompt selection, and upload controls
 * Used in: ConversionJobPage
 */
const ImageToolbar = ({
                          prompts,
                          selectedPromptId,
                          onPromptChange,
                          onClearAll,
                          onRotateLeft,
                          onRotateRight,
                          onReset,
                          onStartCrop,
                          onCancelCrop,
                          onUpload,
                          isCropping,
                          onBackToMap,
                          isEdit,
                      }: ImageToolbarProps
) => {

    return (

        <>
            <div className="flex flex-col gap-4 p-4 bg-gray-500 rounded">

                <div className="flex items-center justify-center gap-4 flex-wrap">

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-300">Rotate:</span>
                        <IconButton aria-label="rotate left" sx={{color: 'white'}} onClick={onRotateLeft}>
                            <RotateLeftOutlinedIcon/>
                        </IconButton>

                        <IconButton aria-label="rotate right" sx={{color: 'white'}} onClick={onRotateRight}>
                            <RotateRightOutlinedIcon/>
                        </IconButton>
                    </div>


                    <Button
                        onClick={onReset}
                        variant="contained"
                        size="medium">ΕΠΑΝΑΦΟΡΑ</Button>


                    <div className="flex items-center gap-6">
                        <span className="text-md font-semibold text-gray-300">PROMPT:</span>
                        <FormControl size='small' sx={{width: 300}}>
                            <Select
                                value={selectedPromptId || 'Prompt'}
                                onChange={(e) => onPromptChange(Number(e.target.value))}
                                displayEmpty sx={{bgcolor: 'white'}}
                            >

                                {prompts.map((prompt) =>
                                    <MenuItem key={prompt.id} value={prompt.id}>
                                        {prompt.promptName}
                                    </MenuItem>
                                )}
                            </Select>

                        </FormControl>

                        <Button
                            onClick={onClearAll}
                            variant="contained" color="error"
                            size="small">Καθαρισμός</Button>
                    </div>

                </div>


                {!isEdit && (
                    <div className="relative flex items-center justify-center px-8 w-full gap-4">
                        {!isCropping ? (
                            <Button
                                onClick={onStartCrop}
                                variant="contained"
                                color="secondary"
                                size="large"
                                sx={{minWidth: '300px'}}
                            >Crop</Button>
                        ) : (
                            <>
                                <Button
                                    onClick={onCancelCrop}
                                    variant="outlined"
                                    color='secondary'
                                    size="large"
                                    sx={{minWidth: '150px'}}
                                >Cancel Crop

                                </Button>

                                <Button
                                    onClick={onUpload}
                                    variant="contained"
                                    color='secondary'
                                    size="large"
                                    sx={{minWidth: '150px'}}
                                >UPLOAD

                                </Button>
                            </>

                        )}

                        <div className="absolute right-8">
                            <Button
                                onClick={onBackToMap}
                                variant="text"
                                color="primary"
                                size="medium"
                                startIcon={<MapIcon/>}
                                sx={{color: 'lightgray'}}
                            >
                                ΕΠΙΣΤΡΟΦΗ
                            </Button>
                        </div>
                    </div>
                )}

                {isEdit && (
                    <div className="flex items-center justify-end px-8 w-full">
                        <Button
                            onClick={onBackToMap}
                            variant="text"
                            color="primary"
                            size="medium"
                            startIcon={<MapIcon/>}
                            sx={{color: 'lightgray'}}
                        >
                            ΕΠΙΣΤΡΟΦΗ
                        </Button>
                    </div>
                )}


            </div>


        </>
    )
}

export default ImageToolbar;