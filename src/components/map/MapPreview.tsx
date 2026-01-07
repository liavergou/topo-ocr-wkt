import {Box, Typography} from '@mui/material';
import type { MapPreviewProps } from '@/types';
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Polygon, WMSTileLayer, LayersControl, CircleMarker, Popup} from 'react-leaflet';
import L, { latLngBounds } from 'leaflet';
import { egsa87ToWgs84 } from '@/utils/projectionConverter';
import MouseCoordinatesDisplay from './MouseCoordinatesDisplay';

/**
 * Displays polygon on interactive map with coordinates preview
 * Shows polygon geometry, coordinate markers with popups, and calculated area
 * Supports Google Satellite and ΕΚΧΑ orthophoto maps
 * Uses: MouseCoordinatesDisplay
 * Used in: OcrResult
 */

//https://react-leaflet.js.org/docs/start-introduction/
//https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z} google satellite

//<MapContainer>->Map Container
//<TileLayer>->Tile basemap (Google)
//<WMSTileLayer>->WMS layers (GeoServer)
//<Popup>-> Popups
//<Polygon>->Polygons


//αλλαγές στον πίνακα συντεταγμένων τα πιάνει απο το handleChange του CoordinateTable->setCoordinates(updated)->useEffect του calculatedArea

const MapPreview = ({ coordinates, area }: MapPreviewProps) => {

    //μετατροπή σε lat lon με το util
    const latLngs: [number, number][] = coordinates.map(c => egsa87ToWgs84(c.x, c.y)); //μετατροπη ΕΓΣΑ87 -> WGS84
    //κεντράρισμα χάρτη
    const bounds = latLngs.length > 0 ? latLngBounds(latLngs) : undefined;

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



                <Polygon positions={latLngs}
                pathOptions={{color:'#F5F02A', weight:4, fillOpacity: 0}}/>

                {/* markers στις συντεταγμενες */}
                {latLngs.map((point, index) => (
                    <CircleMarker
                        key={`point-${index}`}
                        center={point}
                        radius={3}
                        pathOptions={{
                            color: 'magenta',
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>Σημείο {index + 1}</strong><br/>
                                X: {coordinates[index].x}<br/>
                                Y: {coordinates[index].y}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/*ΕΜΦΑΝΙΣΗ ΣΥΝΤΕΤΑΓΜΕΝΩΝ ΧΑΡΤΗ*/}
                <MouseCoordinatesDisplay />

            </MapContainer>

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
                    zIndex: 1000, //για να κάτσει πανω απο τον χάρτη
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

