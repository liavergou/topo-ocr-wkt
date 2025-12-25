// import Button from "./ui/Button.tsx";
import Button from '@mui/material/Button';
import {FormControl, IconButton, MenuItem, Select} from "@mui/material";
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import type {ImageToolbarProps} from '@/types.ts';
//https://mui.com/material-ui/api/icon-button/#props
//area-label είναι accessibility attribute

const ImageToolbar = ({
                          prompts,
                          selectedPromptId,
                          onPromptChange,
                          onClearAll,
                          // onZoomIn,
                          // onZoomOut,
                          onRotateLeft,
                          onRotateRight,
                          onReset,
                          onStartCrop,
                          onCancelCrop,
                          onUpload,
                          isCropping,
                      }: ImageToolbarProps
) => {

    return (

        <>
            <div className="flex flex-col gap-4 p-4 bg-gray-500 rounded">

                {/*ΠΆΝΩ ΣΕΙΡΑ*/}
                <div className="flex items-center justify-center gap-4 flex-wrap">

                    {/*    /!*ZOOM*!/*/}
                    {/*    <div className="flex items-center gap-2">*/}
                    {/*    <span className="text-sm font-semibold text-gray-300">Zoom:</span>*/}

                    {/*    <div className="flex items-center justify-center gap-4 flex-wrap">*/}

                    {/*    <Button*/}
                    {/*        onClick={onZoomIn}*/}
                    {/*        variant="contained"*/}
                    {/*        size="small">+</Button>*/}
                    {/*    <Button*/}
                    {/*        onClick={onZoomOut}*/}
                    {/*        variant="contained"*/}
                    {/*        size="small">-</Button>*/}
                    {/*</div>*/}


                    {/*ROTATE*/}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-300">Rotate:</span>
                        <IconButton aria-label="rotate left" sx={{color: 'white'}} onClick={onRotateLeft}>
                            <RotateLeftOutlinedIcon/>
                        </IconButton>

                        <IconButton aria-label="rotate right" sx={{color: 'white'}} onClick={onRotateRight}>
                            <RotateRightOutlinedIcon/>
                        </IconButton>
                    </div>


                    {/*RESET*/}
                    <Button
                        onClick={onReset}
                        variant="contained"
                        size="medium">ΕΠΑΝΑΦΟΡΑ</Button>



                    {/*PROMPTS DROPDOWN*/}
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

                        {/*CLEAR*/}
                        <Button
                            onClick={onClearAll}
                            variant="contained" color="error"
                            size="small">Καθαρισμός</Button>
                    </div>

                </div>


                {/*Η CROP ΚΟΥΜΠΙ Ή CANCEL*/}
                <div className="flex items-center justify-center px-8 w-full gap-4">
                    {!isCropping ? (
                        <Button
                            onClick={onStartCrop}
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{width:'50%'}}
                        >Crop</Button>
                    ) : (
                        <>
                        <Button
                            onClick={onCancelCrop}
                            variant="outlined"
                            color='secondary'
                            size="large"
                            sx={{width:'25%'}}
                        >Cancel Crop

                        </Button>

                        <Button
                            onClick={onUpload}
                            variant="contained"
                            color='secondary'
                            size="large"
                            sx={{width:'25%'}}
                        >UPLOAD

                        </Button>
                        </>

                    )}
                </div>


            </div>


        </>
    )
}

export default ImageToolbar;