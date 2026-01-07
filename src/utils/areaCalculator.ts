import type {Coordinate} from "@/types.ts";

/**
 * Calculate polygon area using Shoelace formula
 * @param coordinates - Array of coordinates from OCR response
 * @returns Calculated area in square meters
 */

export function calculatePolygonArea(coordinates: Coordinate[] ): number
{

    //ελεγχος ύπαρξης
    if ((coordinates.length <3) || (!coordinates)) return 0;

    const points = coordinates.filter((p=> p.x && p.y))

    //Υπολογισμός με Shoelace formula https://www.geeksforgeeks.org/dsa/area-of-a-polygon-with-given-n-ordered-vertices/
    if (points.length< 3) return 0;

    let  area = 0.0;

    // Calculate value of shoelace formula
    let j = points.length - 1;

    for (let i = 0; i <points.length; i++)
    {
        area += (points[j].x + points[i].x) * (points[j].y - points[i].y);

        // j is previous vertex to i
        j = i;
    }

    area = (Math.abs(area / 2.0));

    return area
}