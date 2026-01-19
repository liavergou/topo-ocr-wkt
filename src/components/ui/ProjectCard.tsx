import type {ProjectCardProps} from "@/types.ts";
import Typography from "@mui/material/Typography";
import {Card, CardActionArea, CardContent} from "@mui/material";

/**
 * Reusable card component
 * @param projectName
 * @param onClick
 */

const ProjectCard =({projectName,onClick}: ProjectCardProps) =>{

    return (
        <>
        <Card elevation={3} sx={{height: '100%',backgroundColor:'secondary.light', '&:hover':{backgroundColor:'secondary.dark',elevation:6} }}>
            <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
            <CardContent>

                <Typography variant="h4" fontWeight="medium" color="text.secondary" >
                    {projectName}
                </Typography>

            </CardContent>
        </CardActionArea>
        </Card>
        </>
    )

}

export default ProjectCard;