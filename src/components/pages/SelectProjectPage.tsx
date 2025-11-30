import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useAuth from "@/hooks/useAuth.ts";
import type {Project} from "@/schemas/projects.ts";
import {useEffect, useState} from "react";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import {useNavigate} from "react-router-dom";
import {getMyAssignedProjects} from "@/services/api.account.ts";
import {getAllProjects} from "@/services/api.projects.ts";
import {CircularProgress, Grid} from "@mui/material";
import ProjectCard from "@/ui/ProjectCard.tsx";

const SelectProjectPage =() => {

    const navigate = useNavigate();
    const {userInfo} = useAuth(); //αν αλλάξει ο χρήστης πρέπει να ξανατρέξει.προσοχη επαιρνα rerender loop.εβαλα το userInfo σε Memo
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true); //για τη φόρτωση

    useEffect(() => {
        if (!userInfo) return;

        setLoading(true);

        //αν admin ή manager apo getAll αλλιως getMyAssignedProjects. πίνακας users-projects
        const getPromise = userInfo.role ==='Admin' || userInfo.role ==='Manager'
        ? getAllProjects():getMyAssignedProjects();

        //επειδή εξαρτάται από το role
        getPromise
            .then((data) =>{
                setProjects(data);
            })
            .catch((err) => {
                console.error("Error loading projects:", err);
                alert(getErrorMessage(err));
            })
            .finally(() => { // απαραίτητο
                setLoading(false);
            });

    }, [userInfo]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Επιλογή Μελέτης
            </Typography>

            {/*αν εχει μελέτες ή αν δεν έχει μελέτες*/}
            {projects.length ===0?(
                <Typography sx={{ ml: 3, mt: 2 }}>
                    Δεν βρέθηκαν μελέτες
                </Typography>
                ) : (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {projects.map((p) => (
                        <ProjectCard
                            id={p.id}
                            projectName={p.projectName}
                            jobsCount={p.jobsCount}
                            onClick={() => navigate(`/projects/${p.id}/cropper`)}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default SelectProjectPage;