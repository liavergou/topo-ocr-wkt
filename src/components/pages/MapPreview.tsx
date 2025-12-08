import { Box, Typography } from '@mui/material';
import type { MapPreviewProps } from '@/types';
import 'leaflet/dist/leaflet.css';

const MapPreview = ({ coordinates, area }: MapPreviewProps) => {

    return (
        <Box
            sx={{
                width: '100%',
                height: '400px',
                border: '2px solid',
                borderColor: 'primary',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Χάρτης
            </Typography>

            {/*AREA*/}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 15,
                    left: 15,
                    bgcolor: 'primary.light',
                    color: 'gray',
                    px: 1,
                    py: 1,
                    borderRadius: 1,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.light' }}>
                    {area.toFixed(2)} τ.μ.
                </Typography>


                <Typography variant="body1" color="secondary.light">
                        Σημεία: {coordinates.length}
                    </Typography>
            </Box>

        </Box>
    );
};

export default MapPreview;

