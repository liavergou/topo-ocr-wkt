import type {ProjectCardProps} from "@/types.ts";
import Typography from "@mui/material/Typography";
import {Card, CardActionArea, CardContent} from "@mui/material";

const ProjectCard =({projectName,jobsCount,onClick}: ProjectCardProps) =>{
// αν θελω elevation ΟΧΙ variant outlined
    return (
        <>
        <Card elevation={3} sx={{height: '100%',backgroundColor:'secondary.light', '&:hover':{backgroundColor:'secondary.dark',elevation:6} }}>
            <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
            <CardContent>

                <Typography variant="h3" fontWeight="medium" color="text.secondary" >
                    {projectName}
                </Typography>

                <Typography sx={{mt:2,mb:2}} variant="h5" fontWeight="medium" color="text.secondary">
                    Πλήθος Πολυγώνων: {jobsCount}
                </Typography>
            </CardContent>
        </CardActionArea>
        </Card>
        </>
    )

}

export default ProjectCard;