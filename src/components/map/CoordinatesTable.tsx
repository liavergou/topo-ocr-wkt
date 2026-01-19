import type {Coordinate, CoordinatesTableProps} from "@/types";
import {useEffect, useState} from "react";
import {TextField} from "@mui/material";

/**
 * Editable table for managing polygon coordinates.
 * Transfer changes to parent component in real-time.
 * Used in: OcrResult
 */


    const CoordinatesTable = ({ coordinates, onChange }: CoordinatesTableProps) => {

        const coordinatesToText = (coords: Coordinate[]): string => {
            return coords.map(c => `${c.x},${c.y}`).join('\n');
        };

        const textToCoordinates = (text: string): typeof coordinates => {
            return text
                .split('\n')
                .map((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;

                    const [x, y] = trimmed
                        .split(',')
                        .map(val =>
                            parseFloat(val.trim()));

                    if (Number.isNaN(x) || Number.isNaN(y)) return null;

                    return {
                        order: index + 1,
                        x,
                        y
                    };
                })
                .filter(coord => coord !== null);
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newText = e.target.value;
            setText(newText);

            const newCoords = textToCoordinates(newText);
            if (newCoords.length >= 3) {
                onChange(newCoords);
            }
        };

        const [text, setText] = useState(() => coordinatesToText(coordinates));

        useEffect(() => {
            setText(coordinatesToText(coordinates));
        }, [coordinates]);

        return(
        <>
            <TextField
                id="coordinates"
                label="Συντεταγμένες ΕΓΣΑ87"
                value={text}
                variant="outlined"
                multiline
                rows={20}
                onChange={handleChange}
                margin={"dense"}
                fullWidth
                size={"medium"}
            />


        </>
    )

}

export default CoordinatesTable;