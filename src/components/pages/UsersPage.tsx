import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import type { User } from '@/types';
import { getUsers, deleteUser } from '@/services/api.users';
import {getErrorMessage} from "@/utils/errorHandler.ts";

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Φόρτωση users από API
    useEffect(() => {
        setLoading(true);
        getUsers()
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error("Error loading users:", err);
                alert(getErrorMessage(err));
            })
            .finally(() => setLoading(false));
    }, []);

    // Delete user
    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον χρήστη;')) {
            return;
        }

        try {
            await deleteUser(id);

            // Αφαίρεση από το state
            setUsers(users.filter(user => user.id !== id));
            alert('Ο χρήστης διαγράφηκε επιτυχώς');
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert(getErrorMessage(err));
        }
    };

    const columns: GridColDef<User>[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'lastname', headerName: 'Επίθετο', width: 150 },
        { field: 'firstname', headerName: 'Όνομα', width: 150 },
        { field: 'role', headerName: 'Ρόλος', width: 120 },
        {
            field: 'actions',
            headerName: 'Ενέργειες',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/users/${params.row.id}`)}
                        title="Επεξεργασία"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        title="Διαγραφή"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>

                    {/*ASSIGN PROJECTS*/}
                    {params.row.role === 'Member' && (
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/users/${params.row.id}/projects`)}
                        title="Μελέτες"
                    >
                        <AssignmentIndIcon fontSize="small" />
                    </IconButton>)}
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            {/* Header με τίτλο και κουμπί */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Διαχείριση Χρηστών
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/users/new')}
                >
                    ΝΕΟΣ ΧΡΗΣΤΗΣ
                </Button>
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
};

export default UsersPage;