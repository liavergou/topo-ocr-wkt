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
    onClearAll
}: ImageToolbarProps
) =>{

    return (

        <>
            <div className="flex items-center justify-center gap-4 p-4 bg-slate-800 rounded-xl ">

                <div className="flex items-center gap-10">
                    <span className="text-sm font-semibold text-gray-300">Zoom:</span>

                    <Button
                        // onClick={onZoomIn}
                        variant="contained"
                        size="small">+</Button>
                    <Button
                        // onClick={onZoomOut}
                        variant="contained"
                        size="small">-</Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-300">Rotate:</span>
                    <IconButton aria-label="rotate left" sx={{ color: 'white' }}>
                        <RotateLeftOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="rotate right" sx={{ color: 'white' }}>
                        <RotateRightOutlinedIcon />
                    </IconButton>

            </div>
            <Button
                // onClick={onReset}
                variant="contained"
                size="small">Reset</Button>
            <Button
                onClick={onClearAll}
                variant="contained" color="error"
                size="small">Καθαρισμός</Button>




            {/*PROMPTS DROPDOWN*/}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">Prompt:</span>
                <FormControl size='medium' sx={{width: 300}}>
                    <Select
                        value={selectedPromptId || 'Prompt'}
                        onChange={(e) => onPromptChange(Number(e.target.value))}
                        displayEmpty sx={{bgcolor : 'white'}}
                        >

                        {prompts.map((prompt) =>
                            <MenuItem key={prompt.id} value={prompt.id}>
                                {prompt.promptName}
                            </MenuItem>
                        )}
                    </Select>

                </FormControl>
            </div>


        </div>


    </>
)
}

export default ImageToolbar;