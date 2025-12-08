import proj4 from 'proj4';

//  EGSA87 (EPSG:2100)
//https://github.com/josueggh/proj4-list/blob/master/src/list.js
proj4.defs('EPSG:2100', '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +datum=GGRS87 +units=m +no_defs');

export const egsa87ToWgs84 = (x: number, y: number): [number, number] => {
    const [lng, lat] = proj4('EPSG:2100', 'EPSG:4326', [x, y]);
    return [lat, lng];
};

