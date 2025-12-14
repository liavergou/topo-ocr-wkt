import { useState, useEffect } from 'react';
import { Box, Paper, Button } from '@mui/material';
import MapPreview from "@/components/map/MapPreview.tsx";
import type { Coordinate} from '@/types.ts';
import {calculatePolygonArea} from "@/utils/areaCalculator.ts";
import CoordinatesTable from "@/components/map/CoordinatesTable.tsx";


type CoordinatesResultProps = {
    initialCoordinates: Coordinate[];
};

const OcrResult = ({ initialCoordinates }: CoordinatesResultProps) => {

    const [coordinates, setCoordinates] = useState<Coordinate[]>(initialCoordinates); //ΣΥΝΤΕΤΑΓΜΕΝΕΣ προσοχή source of truth για να το δώσει στα children. αλλάζει στο onChange των children
    const [area, setArea] = useState(0); //ΕΜΒΑΔΟΝ

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

    const handleSave = () => {
        // TODO: Save to backend
        console.log('Saving coordinates:', coordinates);
        alert('Αποθήκευση στο backend (TODO)');
    };

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
                        ΑΠΟΘΗΚΕΥΣΗ
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


