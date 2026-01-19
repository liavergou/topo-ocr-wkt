import { useState } from 'react';
import { Box } from '@mui/material';
import { useMapEvents } from 'react-leaflet';
import { wgs84ToEgsa87 } from '@/utils/projectionConverter';

/**
 * Displays real-time mouse coordinates in EGSA87 format on the map
 * Uses Leaflet map events to track mouse position and converts WGS84 to EGSA87
 * Used in: ConversionJobsPage, MapPreview
 */

const MouseCoordinatesDisplay = () => {
    const [coords, setCoords] = useState<[number, number] | null>(null);

    useMapEvents({
        mousemove: (e) => {
            const [x, y] = wgs84ToEgsa87(e.latlng.lat, e.latlng.lng);
            setCoords([x, y]);
        },

        mouseout: () => {
            setCoords(null);
        }
    });
    if (!coords) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                bgcolor: 'white',
                color: 'darkviolet',
                p: 1,
                borderRadius: 2,
                zIndex: 1000,
                fontSize: '0.8rem',
            }}
        >
            X: {coords[0].toFixed(2)} , Y: {coords[1].toFixed(2)}
        </Box>
    );
};

export default MouseCoordinatesDisplay;
