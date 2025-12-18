import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import { MapContainer, TileLayer, WMSTileLayer, LayersControl, GeoJSON, useMapEvents } from 'react-leaflet';
import type { FeatureCollection } from 'geojson'; // npm package με type definitions για GeoJSON
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {exportSHPProjectGeoserverJobs, getProjectGeoserverJobs} from '@/services/api.projects';
import { getErrorMessage } from '@/utils/errorHandler';
import type { JobDataProps } from "@/types.ts";
import Button from "@mui/material/Button";

const ProjectMapPage = () => {
    const { projectId } = useParams<{ projectId: string }>(); //απο το project id του url
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null); //state για τα GeoJSON δεδομένα. τύπος FeatureCollection
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobDataProps | null>(null); // Επιλεγμένο job για προβολή
    const [activatedFilter, setActivatedFilter] = useState<'ΕΝΕΡΓΑ' | 'ΔΙΕΓΡΑΜΜΕΝΑ' | 'ΟΛΑ'>('ΟΛΑ'); // για το φίλτρο στα ενεργά/διεγραμμενα

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
            alert(getErrorMessage(err))
        }
    };

    // υπολογισμός bounds για zoom (από τα αρχικά δεδομένα για να μην αλλάζει το zoom με το φίλτρο)
    const bounds = geoData ? L.geoJSON(geoData).getBounds() : undefined;

    // για να κλείνει το info box όταν click έξω από polygon
    function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
        useMapEvents({
            click: () => {
                onMapClick();
            },
        });
        return null;
    }

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        getProjectGeoserverJobs(Number(projectId))
            .then((data) => {
                setGeoData(data);
                setError(null);
            })
            .catch((err) => {
                console.error('Error loading GeoJSON:', err);
                setError(getErrorMessage(err));
            })
            .finally(() => setLoading(false)); //καθάρισμα
    }, [projectId]);

    //φίλτρο για ενεργα/διεγραμμενα/ολα
    let displayedGeoData: FeatureCollection | null = null; //για να μπορω να κανω reassign μετα

    if (geoData) {
        let filteredFeatures= geoData.features;
        switch (activatedFilter){
            case 'ΕΝΕΡΓΑ':  filteredFeatures = geoData.features.filter(f => f.properties?.DeletedAt ===null);
            break;
            case 'ΔΙΕΓΡΑΜΜΕΝΑ': filteredFeatures = geoData.features.filter(f => f.properties?.DeletedAt !==null);
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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

    if (!geoData || !geoData.features || geoData.features.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Δεν βρέθηκαν δεδομένα για αυτό το project.</Typography>
            </Box>
        );
    }

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: 2 }}>

            {/*ΦΙΛΤΡΟ*/}
            <FormControl>
                <Select
                    value={activatedFilter}
                    onChange={(e) => setActivatedFilter(e.target.value as 'ΕΝΕΡΓΑ' | 'ΔΙΕΓΡΑΜΜΕΝΑ' | 'ΟΛΑ')}>

                    <MenuItem value="ΟΛΑ">ΟΛΑ</MenuItem>
                    <MenuItem value="ΕΝΕΡΓΑ">ΕΝΕΡΓΑ</MenuItem>
                    <MenuItem value="ΔΙΕΓΡΑΜΜΕΝΑ">ΔΙΕΓΡΑΜΜΕΝΑ</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color='secondary'
                onClick={handleExportSHP}>
                ΕΞΑΓΩΓΗ SHP
            </Button>
        </Box>

            <Box sx={{ height: '77vh', border: '2px solid', borderColor: 'primary.main', borderRadius: 2 }}>
                {/*ΧΑΡΤΗΣ MAP CONTAINER ΤΟΥ LEAFLET*/}
                <MapContainer
                    style={{ height: '100%', width: '100%' }}
                    bounds={bounds}
                    boundsOptions={{ padding: [50, 50], maxZoom: 30 }}
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
                            key={activatedFilter} //force rerender https://dev.to/malapashish/mastering-react-re-renders-the-key-prop-hack-you-need-to-know-17hh
                            data={displayedGeoData}
                            style={{
                                color: '#ff00ff',
                                weight: 4,
                                fillOpacity: 0.1
                            }}
                            //https://leafletjs.com/reference.html#geojson-resetstyle
                            onEachFeature={(feature, layer) => {
                                layer.on('click', (e) => {
                                    L.DomEvent.stopPropagation(e) // Σταματά το event να φτάσει στο map (οχι e.stopPropagation does not exist σφαλμα. βλ. stopPropagation(<DOMEvent> ev) στο documentation)
                                    setSelectedJob(feature.properties);
                                });
                            }}
                        />
                    )}

                    {/* Handler για να κλείνει το info box όταν κάνεις click έξω από polygon */}
                    <MapClickHandler onMapClick={() => setSelectedJob(null)} />

                    {/* Σταθερός πίνακας πληροφοριών */}
                    {selectedJob && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 15,
                                left: 15,
                                bgcolor: '#F2DADA',
                                px: 1,
                                py: 1,
                                zIndex: 1000, //για να κάτσει πανω απο τον χάρτη
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                JobId:{selectedJob.JobId}
                            </Typography>

                            {/*ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ ΑΠΟ GEOJSON*/}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                <Typography>Μελέτη: {selectedJob.ProjectName || '-'}</Typography>
                                <Typography>Εμβαδόν: {selectedJob.Area || '-'} τ.μ.</Typography>
                                <Typography>Original File: {selectedJob.OriginalFile || '-'}</Typography>
                                <Typography>Cropped File: {selectedJob.CroppedFile || '-'}</Typography>
                                <Typography>Μοντέλο: {selectedJob.GenAIModel || '-'}</Typography>
                                <Typography>Prompt: {selectedJob.PromptName || '-'}</Typography>
                                <Typography>Χρήστης: {selectedJob.Username || '-'}</Typography>
                                <Typography>Διαγραφή: {selectedJob.DeletedAt || '-'}</Typography>
                                <Typography>Status: {selectedJob.JobStatus || '-'}</Typography>
                            </Box>
                        </Box>
                    )}
                </MapContainer>
            </Box>
        </>
    );
};


export default ProjectMapPage;
