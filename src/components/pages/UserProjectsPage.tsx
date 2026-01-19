import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Project} from "@/schemas/projects.ts";
import {getUserProjects, updateUserProjects} from "@/services/api.users.ts";
import {getAllProjects} from "@/services/api.projects.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useAlert} from "@/hooks/useAlert";
import {AlertDisplay} from "@/components/ui/AlertDisplay";
import {Checkbox, FormControlLabel, FormGroup, Stack} from "@mui/material";
import Button from "@mui/material/Button";

/**
 * Admin/Manager page for assigning projects to users with role "Member"
 */

const UserProjectsPage=()=>{

    const { userId } = useParams();
    const navigate = useNavigate();
    const { success, error, showSuccess, showError, clear } = useAlert();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        Promise.all([
            getAllProjects(),
            getUserProjects(Number(userId))
        ])
            .then(([allProjects, userProjects]) => {
                setProjects(allProjects);
                setSelectedProjectIds(userProjects.projectIds);
            })
            .catch((err) => {
                console.error("Error loading user:", err);
                showError(getErrorMessage(err));
            })
            .finally(() => setLoading(false));
    }, [userId, showError]);

    const handleCheckboxChange = (projectId:number, checked:boolean)=>{
        if (checked){
            setSelectedProjectIds([...selectedProjectIds, projectId]); //spread τα στοιχεία του πίνακα σε νεο πίνακας, add το projectId

        }else {
            setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
        }
    };

    const handleSave = async()=>{
        if (!userId) return;

        setSaving(true);
        try {
            await updateUserProjects(Number(userId), {projectIds: selectedProjectIds});
            showSuccess('Οι μελέτες ενημερώθηκαν επιτυχώς')
            navigate('/users')
        } catch (err) {
            console.error("Error:", err);
            showError(getErrorMessage(err));
        }finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Box sx={{ maxWidth: '48rem', mx: 'auto', mt: 6, p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Ανάθεση Μελετών
                </Typography>

                <AlertDisplay success={success} error={error} onClose={clear} />

                {loading ? (
                    <Typography>Φόρτωση...</Typography>
                ) : (
                    <Stack spacing={4}>
                        <FormGroup>
                            {projects.map((project) => (
                                <FormControlLabel
                                    key={project.id}
                                    control={
                                        <Checkbox
                                            checked={selectedProjectIds.includes(project.id)}
                                            onChange={(e) => handleCheckboxChange(project.id, e.target.checked)}
                                        />
                                    }
                                    label={project.projectName}
                                />
                            ))}
                        </FormGroup>

                        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Αποθήκευση...' : 'ΑΠΟΘΗΚΕΥΣΗ'}
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/users')}
                            >
                                ΕΞΟΔΟΣ
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Box>

        </>
    )
}
export default UserProjectsPage;