import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {USER_ROLES,type UserCreate,userCreateSchema,type UserRole,type UserUpdate,userUpdateSchema} from "@/schemas/users";
import { useEffect } from "react";
import {TextField, Box, Stack, FormControl, InputLabel, Select, MenuItem, FormHelperText} from "@mui/material";
import Button from "@mui/material/Button";
import { getUser, createUser, updateUser } from "@/services/api.users";



const UserPage = () => {
    const { userId } = useParams();
    const isEdit = Boolean(userId);
    const navigate = useNavigate();


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(
            isEdit?
                userUpdateSchema : userCreateSchema),
        defaultValues: isEdit ? {
            email: "",
            lastname: "",
            firstname: "",
            role: "Member" as UserRole //ΠΡΟΣΟΧΗ! δεν εφτανε το σκέτο "Member" γιατι ειναι literal string type
        } : {
            username: "",
            password: "",
            email: "",
            lastname: "",
            firstname: "",
            role: "Member" as UserRole
        }
    });

    useEffect(() => {
        if (!isEdit || !userId) return;

        getUser(Number(userId))
            .then((data) => {
                reset({
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    role: data.role,
                });
            })
            .catch((err) => {
                console.error("Error loading user:", err);
                alert('Σφάλμα κατά τη φόρτωση χρήστη');
            });
    }, [isEdit, userId, reset]);

    const onSubmit = async (data: UserCreate | UserUpdate) => {
        try {
            if (isEdit && userId) {
                await updateUser(Number(userId), data as UserUpdate);
                alert("Ο χρήστης ενημερώθηκε επιτυχώς");
            } else {
                await createUser(data as UserCreate);
                alert("Ο χρήστης δημιουργήθηκε επιτυχώς");
            }
            navigate("/users");
        } catch (error) {
            console.error("Error:", error);
            alert(
                error instanceof Error ? error.message : "Σφάλμα κατά την αποθήκευση"
            );
        }
    };

    return (
        <Box className="max-w-sm mx-auto mt-12 p-8 border rounded-md space-y-4">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? 'Επεξεργασία Χρήστη' : 'Νέος Χρήστης'}
            </h1>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Stack spacing={4}>

                    {/* Username - μόνο σε create mode */}
                    {!isEdit && (
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                    fullWidth
                                />
                            )}
                        />
                    )}

                    {/* Password - μόνο σε create mode */}
                    {!isEdit && (
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    fullWidth
                                />
                            )}
                        />
                    )}

                    {/* Email */}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Lastname */}
                    <Controller
                        name="lastname"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Επίθετο"
                                type="text"
                                error={!!errors.lastname}
                                helperText={errors.lastname?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Firstname */}
                    <Controller
                        name="firstname"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Όνομα"
                                type="text"
                                error={!!errors.firstname}
                                helperText={errors.firstname?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel id="role-label">Ρόλος Χρήστη</InputLabel>
                                <Select
                                    {...field}
                                    labelId="role-label"
                                    label="Role"
                                >
                                    {USER_ROLES.map(role => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.role?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />




                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Αποστολή...' : (isEdit ? 'Ενημέρωση' : 'Δημιουργία')}
                    </Button>

                </Stack>
            </Box>
        </Box>
    );
};

export default UserPage;