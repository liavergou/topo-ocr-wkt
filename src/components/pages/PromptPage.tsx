import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {type Prompt, promptSchema} from "@/schemas/prompts";
import { useEffect } from "react";
import {TextField, Box, Stack} from "@mui/material";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import {createPrompt, getPromptById, updatePrompt} from "@/services/api.prompts.ts";

const PromptPage = () => {
    const { promptId } = useParams();
    const isEdit = Boolean(promptId);
    const navigate = useNavigate();


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(promptSchema.omit({id:true})),
        defaultValues: {
            promptName: "",
            promptText: ""
        }
    });

    useEffect(() => {
        if (!isEdit && !promptId) return;

        getPromptById(Number(promptId))
            .then((data) => {
                const values = {
                    promptName: data.promptName,
                    promptText: data.promptText,
                };
                reset(values);
            })
            .catch((err) => {
                console.error("Error getting prompt:", err);
                alert(getErrorMessage(err));
            });
    }, [isEdit, promptId, reset]);

    const onSubmit = async (data:Omit<Prompt,'id'>) => {
        try {
            if (isEdit && promptId) {
                await updatePrompt(Number(promptId), data);
                alert("Το κείμενο ενημερώθηκε επιτυχώς");
            }
            else {
                await createPrompt(data);
                alert("Το κείμενο δημιουργήθηκε επιτυχώς");
            }
            navigate("/prompts");
        } catch (err) {
            console.error("Error:", err);
            alert(getErrorMessage(err));
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '100rem',
                maxHeight: '100rem',
                mx: 'auto',
                mt: 6,
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
                {isEdit ? 'Επεξεργασία Prompt' : 'Νέο Prompt'}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Stack spacing={4}>

                    {/* PromptName - μόνο σε create mode */}

                    <Controller
                        name="promptName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Prompt"
                                error={!!errors.promptName}
                                helperText={errors.promptName?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Prompt Text - Multiline */}
                    <Controller
                        name="promptText"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Κείμενο Prompt"
                                multiline
                                rows={15}
                                error={!!errors.promptText}
                                helperText={errors.promptText?.message}
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-root': {
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                    }
                                }}
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
                                    onClick={()=> navigate("/prompts")}>ΕΞΟΔΟΣ</Button>
                        </Box>
                    </Box>

                </Stack>
            </Box>
        </Box>
    );
};

export default PromptPage;