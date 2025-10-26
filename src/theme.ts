import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {

        mode: 'light',
        primary: {
            // βασικο χρώμα
            main: '#1976d2',
        },
        //σελίδα
        background: {
            default: grey[200],
            // (Card, AppBar, Menu)
            paper: '#ffffff', //λευκό
        },
        text: {
            // κείμενο
            primary: grey[900], // Σκούρο γκρι
            secondary: grey[700], // Ανοιχτό γκρι
        },
    },
    typography: {
        // γραμματοσειρά
        fontFamily: 'Roboto, "Helvetica Neue", Arial',
    },
});

export default theme;