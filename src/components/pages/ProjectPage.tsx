import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {type ProjectBase, projectBaseSchema} from "@/schemas/projects";
import { useEffect } from "react";
import {TextField, Box, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { getAllProjectById, createProject, updateProject } from "@/services/api.projects";
import Typography from "@mui/material/Typography";
import {getErrorMessage} from "@/utils/errorHandler.ts";

const ProjectPage = () => {
    const { projectId } = useParams();
    const isEdit = Boolean(projectId);
    const navigate = useNavigate();


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(projectBaseSchema),
        defaultValues: {
            projectName: "",
            description: "",
        }
    });

    useEffect(() => {
        if (!isEdit && !projectId)
            return;

        getAllProjectById(Number(projectId))
            .then((data) => {
                const values = {
                    projectName: data.projectName,
                    description: data.description,
                };
                reset(values);
            })
            .catch((err) => {
                console.error("Error getting project:", err);
                alert(getErrorMessage(err));
            });
    }, [isEdit, projectId, reset]);

    const onSubmit = async (data: ProjectBase) => {
        try {
            if (isEdit && projectId) {
                await updateProject(Number(projectId), data);
                alert("Η μελέτη ενημερώθηκε επιτυχώς");
            }
            else {
                await createProject(data);
                alert("Η μελέτη δημιουργήθηκε επιτυχώς");
            }
            navigate("/projects");
        } catch (err) {
            console.error("Error:", err);
            alert(getErrorMessage(err));
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '48rem',
                mx: 'auto',
                mt: 6,
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
                {isEdit ? 'Επεξεργασία Μελέτης' : 'Νέα Μελέτη'}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Stack spacing={4}>

                    {/* ProjectName - μόνο σε create mode */}

                    <Controller
                        name="projectName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Μελέτη"
                                error={!!errors.projectName}
                                helperText={errors.projectName?.message}
                                fullWidth
                            />
                        )}
                    />




                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Περιγραφή"
                                type="text"
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', gap:4, justifyContent:'space-between', mt: 2 }}>
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Αποστολή...' : (isEdit ? 'ΕΝΗΜΕΡΩΣΗ' : 'ΔΗΜΙΟΥΡΓΙΑ')}
                    </Button>

                    {/*Cancel button*/}
                    <Box>
                        <Button variant={"contained"} color={"secondary"}
                                onClick={()=> navigate("/projects")}>ΕΞΟΔΟΣ</Button>
                    </Box>
                    </Box>

                </Stack>
            </Box>
        </Box>
    );
};

export default ProjectPage;