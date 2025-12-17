import { useState, useEffect } from 'react';
import { Box, Paper, Button } from '@mui/material';
import MapPreview from "@/components/map/MapPreview.tsx";
import type {Coordinate, CoordinatesResultProps} from '@/types.ts';
import {calculatePolygonArea} from "@/utils/areaCalculator.ts";
import CoordinatesTable from "@/components/map/CoordinatesTable.tsx";
import {updateConversionJob} from "@/services/api.jobs.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";

const OcrResult = ({ initialCoordinates ,jobId, onDelete }: CoordinatesResultProps) => {

    const [coordinates, setCoordinates] = useState<Coordinate[]>(initialCoordinates); //ΣΥΝΤΕΤΑΓΜΕΝΕΣ προσοχή source of truth για να το δώσει στα children. αλλάζει στο onChange των children
    const [area, setArea] = useState(0); //ΕΜΒΑΔΟΝ

    //αν αλλαξουν οι αρχικες συντεταγμενες (νεο job χωρις αλλαγη αρχειου) επανυπολογισμος χαρτη και πινακα συντεταγμενων
    useEffect(() => {
        setCoordinates(initialCoordinates);
    }, [initialCoordinates]);

    //Επανυπολογισμός εμβαδού όταν αλλάζει κάτι στις συντεταγμένες. προσοχη το state στο CoordinatesTable θα φέρει αλλαγή
    useEffect(() => {
        if (coordinates.length >= 3) {
            const calculatedArea = calculatePolygonArea(coordinates);
            setArea(calculatedArea);
        }
    }, [coordinates]);

    const handleCoordinatesChange = (updated: Coordinate[]) => {
        setCoordinates(updated);
    };

    const handleSave = async () => {
        try{
            await updateConversionJob(jobId,{coordinates:coordinates});
            alert("Οι συντεταγμένες ενημερώθηκαν επιτυχώς")
        }catch (err){
            console.error("Error updating coordinates:", err);
            alert(getErrorMessage(err));
        }
    };

    const handleReset = ()=>{
        if (confirm('Επαναφορά στις αρχικές συντεταγμένες.')){
            setCoordinates(initialCoordinates);
        }
    }

    const handleExportText = () => {
        const content = coordinates.map(coord => `${coord.x},${coord.y}`).join('\n');
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,'+content;
        link.download = 'coordinates.txt';
        link.click();
    };

    return (

        // ΧΑΡΤΗΣ
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%',pt:1 }}>
            <Paper variant="outlined">
                <MapPreview coordinates={coordinates} area={area} />
            </Paper>

        {/*ΠΙΝΑΚΑΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ*/}
            <Paper variant="outlined">
                <CoordinatesTable
                    key={jobId} //key αναγνωριστικό του component. οταν αλλαζει το jobΙδ , η react κανει remount, καταστρεφει το παλιο component και δημιουργεί νέο με καινουριο state.
                    coordinates={coordinates}
                    onChange={handleCoordinatesChange}
                />

                {/*ΑΠΟΘΗΚΕΥΣΗ ΣΕ ΠΕΡΙΠΤΩΣΗ ΑΛΛΑΓΗΣ*/}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSave}
                        fullWidth
                    >
                        ΑΠΟΘΗΚΕΥΣΗ ΑΛΛΑΓΩΝ
                    </Button>

                    {/*RESET ΑΛΛΑΓΩΝ*/}
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleReset}
                        fullWidth
                    >
                        ΕΠΑΝΑΦΟΡΑ
                    </Button>

                    {/*DELETE CONVERSION JOB*/}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDelete}
                        fullWidth
                    >
                        ΔΙΑΓΡΑΦΗ
                    </Button>

                    {/*EXPORT TXT ΓΙΑ ΘΕΑΣΗ*/}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleExportText}
                        fullWidth
                    >
                        ΕΞΑΓΩΓΗ TXT
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
};

export default OcrResult;


