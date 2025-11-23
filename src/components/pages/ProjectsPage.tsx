import { useNavigate } from 'react-router-dom';
import {Box, Button, Typography, IconButton, TextField} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect, useState} from "react";
import {getPaginatedProjects} from "@/services/api.projects.ts";
import {deleteProject} from "@/services/api.projects.ts";
import type {Project} from "@/schemas/projects.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";


const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState('');


    // Φόρτωση projects από API
    useEffect(() => {
        setLoading(true);


        getPaginatedProjects(1,10, filter)
            .then((response) => setProjects(response.data))
            .catch((err) => {
                console.error("Error loading projects:", err);
                alert(getErrorMessage(err));
            })
            .finally(() => setLoading(false));
    }, [filter]);

    // Delete project
    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη μελέτη;')) {
            return;
        }
        try {
            await deleteProject(id);

            // Αφαίρεση από το state
            setProjects(projects.filter(project => project.id !== id));
            alert('Η μελέτη διαγράφηκε επιτυχώς');
        } catch (err) {
            console.error("Failed to delete project:", err);
            alert(getErrorMessage(err));
        }
    };


        const columns: GridColDef<Project>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'projectName', headerName: 'Μελέτη', width: 250 },
    { field: 'description', headerName: 'Περιγραφή', width: 250 },
    { field: 'jobsCount', headerName: 'Πλήθος Πολυγώνων', width:150},

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
                    onClick={() => navigate(`/projects/${params.row.id}`)}
                    title="Edit"
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                    title="Delete"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        ),
    },
];

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            {/*φιλτρο*/}
            <Box sx={{ my: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Αναζήτηση Μελέτης"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </Box>
            {/* Header με τίτλο και κουμπί */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Διαχείριση Μελετών
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/projects/new')}
                >
                    ΝΕΑ ΜΕΛΕΤΗ
                </Button>
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={projects}
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


export default ProjectsPage;