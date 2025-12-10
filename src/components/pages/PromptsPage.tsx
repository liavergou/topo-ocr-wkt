import { useNavigate } from 'react-router-dom';
import {Box, Button, Typography, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useEffect, useState} from "react";
import {getPaginatedPrompts} from "@/services/api.prompts.ts";
import {deletePrompt} from "@/services/api.prompts.ts";
import type {Prompt} from "@/schemas/prompts.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import { Pagination } from '@mui/material';


const PromptsPage = () => {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null); //Dialog

    // Paginated
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const pageSize = 5;


    // Φόρτωση prompts από API
    useEffect(() => {
        setLoading(true);

        getPaginatedPrompts(page,pageSize, filter)
            .then((response) => {
                setPrompts(response.data);
                const pageCount = Math.ceil(response.totalRecords / pageSize);
                setPageCount(pageCount)})

            .catch((err) => {
                console.error("Error loading prompts:", err);
                alert(getErrorMessage(err));
            })
            .finally(() => setLoading(false));
    }, [filter, page]);

    // Delete prompt
    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το Prompt;')) {
            return;
        }
        try {
            await deletePrompt(id);

            // Αφαίρεση από το state
            setPrompts(prompts.filter(prompt => prompt.id !== id));
            alert('Το Prompt διαγράφηκε επιτυχώς');
        } catch (err) {
            console.error("Failed to delete prompt:", err);
            alert(getErrorMessage(err));
        }
    };


    const columns: GridColDef<Prompt>[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'promptName', headerName: 'Ονομασία', width: 250 },
        {
            field: 'promptText',
            headerName: 'Κείμενο',
            width: 1000,
            renderCell: (params) => {
                const text = params.value || '';
                const preview = text.length > 150
                    ? text.substring(0, 150) + '...'
                    : text;

                return (
                    <Typography
                        variant="body2"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {preview}
                    </Typography>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Ενέργειες',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => setSelectedPrompt(params.row.promptText)}
                        title="Προβολή πλήρους κειμένου"
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/prompts/${params.row.id}`)}
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
                </Box>
            ),
        },
    ];

    return (
        <>
        <Box sx={{ p: 2, width: '100%' }}>
            {/*φιλτρο*/}
            <Box sx={{ my: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Αναζήτηση Prompt"
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
                    Διαχείριση Prompts
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/prompts/new')}
                >
                    ΝΕΟ PROMPT
                </Button>
            </Box>

            {/* DataGrid */}
            {/*//https://github.com/mui/mui-x/issues/417*/}
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={prompts}
                    columns={columns}
                    loading={loading}
                    hideFooterPagination
                    rowHeight={60}
                    sx={{ '& .MuiDataGrid-columnHeaderTitleContainer': { whiteSpace: 'normal' }, }}
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

        {/* Modal Dialog για τη προβολή του πλήρους κειμένου prompt */}
        <Dialog
            open={Boolean(selectedPrompt)} // ****** αλλιως !! πρώτο true/false . το δευτερο αντιστρέφει τη boolean τιμη του προηγούμενου και παιρνεις τη πραγματικη. αν null τοτε θα ήταν falsy
            onClose={() => setSelectedPrompt(null)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Πλήρες Κείμενο Prompt</DialogTitle>
            <DialogContent>
                <Box
                    component="pre"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        maxHeight: '60vh',
                        overflow: 'auto'
                    }}
                >
                    {selectedPrompt}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSelectedPrompt(null)}>
                    ΚΛΕΙΣΙΜΟ
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};


export default PromptsPage;