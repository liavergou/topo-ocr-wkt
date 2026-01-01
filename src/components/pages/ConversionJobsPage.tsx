import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, FormControl, Select, MenuItem, IconButton, Button } from '@mui/material';
import { MapContainer, TileLayer, WMSTileLayer, LayersControl, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import type { FeatureCollection } from 'geojson'; // npm package με type definitions για GeoJSON
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { exportSHPProjectGeoserverJobs, getProjectGeoserverJobs } from '@/services/api.projects';
import { deleteConversionJob } from "@/services/api.jobs";
import { getErrorMessage } from '@/utils/errorHandler';
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import MouseCoordinatesDisplay from '@/components/map/MouseCoordinatesDisplay';
import DeleteIcon from "@mui/icons-material/Delete";
import type { JobDataProps } from "@/types.ts";
import {useNavigate} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import useAuth from '@/hooks/useAuth';
import {useAlert} from '@/hooks/useAlert';
import {AlertDisplay} from '@/components/ui/AlertDisplay';

const ConversionJobsPage = () => {
    const { projectId } = useParams<{ projectId: string }>(); //απο το project id του url
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null); //state για τα GeoJSON δεδομένα. τύπος FeatureCollection
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null); // Επιλεγμένο job για προβολή
    const [activatedFilter, setActivatedFilter] = useState<'ΕΝΕΡΓΑ' | 'ΔΙΕΓΡΑΜΜΕΝΑ' | 'ΟΛΑ'>('ΟΛΑ'); // για το φίλτρο στα ενεργά/διεγραμμενα
    const navigate = useNavigate();
    const { hasAnyRole } = useAuth();
    const { success: alertSuccess, error: alertError, showSuccess, showError, clear } = useAlert();

    // Data loading με useCallback για να μην κανει loop στο render μετα το useEffect
    const loadData = useCallback(async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            const data = await getProjectGeoserverJobs(Number(projectId));
            setGeoData(data);
            setError(null);
        } catch (err) {
            console.error('Error loading GeoJSON:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [projectId]);


    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleExportSHP = async () => {
        try {
            const blob = await exportSHPProjectGeoserverJobs(Number(projectId));
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `project_${projectId}`;
            link.click();
            window.URL.revokeObjectURL(url);
        }catch(err){
            showError(getErrorMessage(err))
        }
    };

    const handleDeleteJob = async (jobId: number) => {
        if (!confirm('Θέλετε να διαγράψετε αυτό το πολύγωνο;')) return;

        try {
            await deleteConversionJob(Number(projectId), jobId);
            setSelectedJobId(null);
            loadData(); //load data ξανα
            showSuccess('Το πολύγωνο διαγράφηκε επιτυχώς');
        } catch (err) {
            console.error('Error deleting job:', err);
            showError(getErrorMessage(err));
        }
    };

    // για να κλείνει το info box όταν click έξω από polygon
    function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
        useMapEvents({
            click: () => {
                onMapClick();
            }
        });
        return null;
    }

    // https://react-leaflet.js.org/docs/api-map/
    function ZoomToFeature({ id, data }: { id: number | null, data: FeatureCollection | null }) {
        const map = useMap();

        useEffect(() => {
            if (id && data) {
                const feature = data.features.find(f => f.properties?.JobId === id);
                if (feature) {
                    const layer = L.geoJSON(feature);
                    const bounds = layer.getBounds();
                    if (bounds.isValid()) {
                        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
                    }
                }
            }
        }, [id, data, map]);

        return null;
    }

    //φίλτρο για ενεργα/διεγραμμενα/ολα
    let displayedGeoData: FeatureCollection | null = null; //για να μπορω να κανω reassign μετα

    if (geoData) {
        let filteredFeatures = geoData.features;
        switch (activatedFilter){
            case 'ΕΝΕΡΓΑ':
                filteredFeatures = geoData.features.filter(f => f.properties?.DeletedAt === null);
                break;
            case 'ΔΙΕΓΡΑΜΜΕΝΑ':
                filteredFeatures = geoData.features.filter(f => f.properties?.DeletedAt !== null);
                break;
            case "ΟΛΑ":
                break;
        }
        //νεο object GeoJSON με τα φιλτραρισμένα features
        displayedGeoData = {
            ...geoData, // spread operator για να κρατήσουμε τα υπόλοιπα properties
            features: filteredFeatures
        };
    }

    // ΠΙΝΑΚΑΣ JOBS
    const rows = displayedGeoData?.features.map(f => f.properties as JobDataProps) || [];

    // sorting : επιλεγμένο row πρώτο
    const sortedRows = selectedJobId
        ? [
            ...rows.filter(r => r.JobId === selectedJobId),  //επιλεγμένο πρώτο
            ...rows.filter(r => r.JobId !== selectedJobId)   //υπόλοιπα μετά
          ]
        : rows;

    //columns
    const columns: GridColDef[] = [
        { field: 'JobId', headerName: 'Κωδικός ocr', width: 80 },
        { field: 'ProjectName', headerName: 'Μελέτη', width: 150 },
        { field: 'OriginalFile', headerName: 'Αρχικό αρχείο', width: 180 },
        { field: 'CroppedFile', headerName: 'Αποκομμένος πίνακας', width: 180 },
        { field: 'Area', headerName: 'Εμβαδόν (τ.μ.)', width: 130, type: 'number' },
        { field: 'GenAIModel', headerName: 'Μοντέλο', width: 120 },
        { field: 'PromptName', headerName: 'Prompt', width: 150 },
        { field: 'Username', headerName: 'Χρήστης', width: 120 },
        { field: 'JobStatus', headerName: 'Κατάσταση', width: 100 },
        { field: 'DeletedAt',headerName: 'Διαγραμμένο',width: 150},
        {
            field: 'actions',
            headerName: 'Ενέργειες',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <>

                <IconButton
                    color="primary"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (params.row.JobId) {
                            navigate(`/projects/${projectId}/conversion-jobs/${params.row.JobId}`);
                        }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (params.row.JobId) handleDeleteJob(params.row.JobId);
                    }}
                    disabled={params.row.DeletedAt !== null}
                >
                    <DeleteIcon fontSize="small" />

                </IconButton>
                </>
            ),
        },
    ];

    // υπολογισμός bounds για zoom (από τα αρχικά δεδομένα για να μην αλλάζει το zoom με το φίλτρο)
    const bounds = geoData && geoData.features.length > 0 ? L.geoJSON(geoData).getBounds() : undefined;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Σφάλμα: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, height: '90vh', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
            <AlertDisplay success={alertSuccess} error={alertError} onClose={clear} />

            {/* Header: Φίλτρο + Export */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={activatedFilter}
                        onChange={(e) => setActivatedFilter(e.target.value as 'ΕΝΕΡΓΑ' | 'ΔΙΕΓΡΑΜΜΕΝΑ' | 'ΟΛΑ')}
                    >
                        <MenuItem value="ΟΛΑ">ΟΛΑ</MenuItem>
                        <MenuItem value="ΕΝΕΡΓΑ">ΕΝΕΡΓΑ</MenuItem>
                        <MenuItem value="ΔΙΕΓΡΑΜΜΕΝΑ">ΔΙΕΓΡΑΜΜΕΝΑ</MenuItem>
                    </Select>
                </FormControl>

                {/*ΕΜΦΑΝΙΣΗ ΜΟΝΟ ADMIN MANAGER*/}
                {hasAnyRole(['Admin', 'Manager']) && (
                    <Button
                        variant="contained"
                        sx={{ bgcolor: 'primary.light' }}
                        onClick={handleExportSHP}
                    >
                        ΕΞΑΓΩΓΗ SHP
                    </Button>
                )}
            </Box>



            {/*ΠΙΝΑΚΑΣ DATA*/}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>

                {/*ΧΑΡΤΗΣ MAP CONTAINER ΤΟΥ LEAFLET*/}
                <Box sx={{ height: '60%', border: '1px solid', borderRadius: 1 }}>
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={bounds? undefined:[37.983936, 23.728130]}
                        zoom={bounds ? undefined : 6}
                        bounds={bounds}
                        boundsOptions={bounds ? { padding: [50, 50], maxZoom: 30 }:undefined}
                    >
                        {/* Layer Control - Radio buttons για basemaps */}
                        <LayersControl position="topright">

                        {/*GOOGLE SATELLITE*/}
                        <LayersControl.BaseLayer checked name="Google Satellite">
                            <TileLayer
                                url="https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                                maxZoom={30}
                            />
                        </LayersControl.BaseLayer>

                        {/* ΕΚΧΑ Ορθοφωτοχάρτης */}
                        <LayersControl.BaseLayer name="ΕΚΧΑ Ορθοφωτοχάρτης">
                            <WMSTileLayer
                                url="https://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx"
                                maxZoom={30}
                                maxNativeZoom={18}
                                layers="ORTHOPHOTOS"
                                format="image/png"
                                transparent={true}
                                crs={L.CRS.EPSG3857}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                        {/* Αν υπάρχουν δεδομένα για εμφάνιση, τότε σχεδίασε το GeoJSON layer */}
                        {displayedGeoData && (
                            <GeoJSON
                                key={activatedFilter}
                                data={displayedGeoData}
                                style={(feature) => {
                                    const isSelected = feature?.properties?.JobId === selectedJobId;
                                    const isDeleted = feature?.properties?.DeletedAt !== null;
                                    return {
                                        color: isSelected ? '#FFFF00' : (isDeleted ? '#d32f2f' : '#ff00ff'), //κίτρινο, κόκκινο, magenta
                                        weight: isSelected ? 5 : 2,
                                        fillOpacity: 0.1
                                    };
                                }}
                                //https://leafletjs.com/reference.html#geojson-resetstyle
                                onEachFeature={(feature, layer) => {
                                    layer.on('click', (e) => {
                                        L.DomEvent.stopPropagation(e); // Σταματά το event να φτάσει στο map (οχι e.stopPropagation does not exist σφαλμα. βλ. stopPropagation(<DOMEvent> ev) στο documentation)
                                        setSelectedJobId(feature.properties?.JobId || null);
                                    });
                                }}
                            />
                        )}

                        {/* Map click handler */}
                        <MapClickHandler onMapClick={() => setSelectedJobId(null)} />

                        {/* Zoom to selected feature */}
                        <ZoomToFeature id={selectedJobId} data={displayedGeoData} />

                        {/*ΕΜΦΑΝΙΣΗ ΣΥΝΤΕΤΑΓΜΕΝΩΝ ΧΑΡΤΗ*/}
                        <MouseCoordinatesDisplay />
                    </MapContainer>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/projects/${projectId}/conversion-jobs/new`)}
                    >
                        ΝΕΟ OCR
                    </Button>
                </Box>

                {/*DATAGRID JOBS*/}
                <Box sx={{ height: '40%', border: '1px solid', borderRadius: 1 }}>
                    <DataGrid
                        sx={{
                            '& .selected-row': {
                                backgroundColor: '#769dbd !important',
                            },
                            '& .MuiDataGrid-row.selected-row:hover': {
                                backgroundColor: '#769dbd !important',
                            },
                        }}
                        rows={sortedRows}
                        columns={columns}
                        getRowId={(row) => row.JobId!}
                        onRowClick={(params) => setSelectedJobId(params.row.JobId || null)}
                        getRowClassName={(params) => params.id === selectedJobId ? 'selected-row' : ''}
                        disableRowSelectionOnClick
                        hideFooterPagination
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ConversionJobsPage;
