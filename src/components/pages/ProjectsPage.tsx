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
import { Pagination } from '@mui/material';


const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState('');

    // Paginated
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const pageSize = 5;


    // Φόρτωση projects από API
    useEffect(() => {
        setLoading(true);

        getPaginatedProjects(page,pageSize, filter)
            .then((response) => {
                setProjects(response.data);
            const pageCount = Math.ceil(response.totalRecords / pageSize);
            setPageCount(pageCount)})

            .catch((err) => {
                console.error("Error loading projects:", err);
                alert(getErrorMessage(err));
            })
            .finally(() => setLoading(false));
    }, [filter, page]);

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
        <Box sx={{ p: 2, width: '100%' }}>
            {/*φιλτρο*/}
            <Box sx={{ my: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Αναζήτηση Μελέτης"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                }}
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
                    hideFooterPagination
                />

        </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_,value) => setPage(value)} //ΙΔΙΑΙΤΕΡΗ ΔΙΟΡΘΩΣΗ***** Για να μη χρησιμοποιήσουμε την πρώτη παράμετρο του event που δεν τη χρησιμοποιούμε βάζουμε "_"
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
};


export default ProjectsPage;