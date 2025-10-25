// import Button from "./ui/Button.tsx";
import Button from '@mui/material/Button';
import {IconButton} from "@mui/material";
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';

//https://mui.com/material-ui/api/icon-button/#props
//area-label είναι accessibility attribute

const ImageToolbar = () =>{

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
                    // onClick={onClearAll}
                    variant="contained" color="error"
                    size="small">Καθαρισμός</Button>
            </div>





        </>
    )
}

export default ImageToolbar;