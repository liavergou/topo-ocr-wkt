import type {Coordinate, CoordinatesTableProps} from "@/types";
import {useEffect, useState} from "react";
import {TextField} from "@mui/material";


    const CoordinatesTable = ({ coordinates, onChange }: CoordinatesTableProps) => {


        // μετατροπή coordinates array σε string για το textfield
        const coordinatesToText = (coords: Coordinate[]): string => {
            return coords.map(c => `${c.x},${c.y}`).join('\n'); //συντεταγμένη, αλλαγη γραμμης κλπ
        };

        // μετατροπή από text σε coordinates array
        const textToCoordinates = (text: string): typeof coordinates => {
            return text
                .split('\n') //split σε γραμμές
                .map((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;//αν δεν επιασε το trimmed τιποτα

                    const [x, y] = trimmed
                        .split(',')
                        .map(val =>
                            parseFloat(val.trim())); //parseFloat string to float. αν αποτυχει NaN

                    //αν είναι και το χ και το y αριθμοί. Το Number ->βλ. docum του NaN
                    if (Number.isNaN(x) || Number.isNaN(y)) return null;

                    return {
                        order: index + 1,
                        x,
                        y
                    };
                })
                .filter(coord => coord !== null); //φιλτρο να επιστρέψει όλα τα coord που δεν ειναι null
        };

        //αποθηκευση αλλαγων στο state
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newText = e.target.value;
            setText(newText);

            const newCoords = textToCoordinates(newText);
            if (newCoords.length >= 3) {  // update μονο πανω απο 3 σημεία
                onChange(newCoords);
            }
        };

        const [text, setText] = useState(() => coordinatesToText(coordinates)); //οχι το state στον parent μονο. προβλημα με συνεχες rerender

        //rerender Πινακας συντεταγμενων οταν αλλαζουν τα coordinates (δευτερο crop στο ιδιο αρχειο)
        useEffect(() => {
            setText(coordinatesToText(coordinates))
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