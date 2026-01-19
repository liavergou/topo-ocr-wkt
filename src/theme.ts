import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {

        mode: 'light',
        primary: {

            main: '#314a66',
        },
        secondary: {
            main: '#fedc97',
        },

        background: {
            default: grey[200],

            paper: '#ffffff',
        },
        text: {
            primary: grey[900],
            secondary: grey[700],
        },
    },
    typography: {
        fontFamily: 'Roboto, "Helvetica Neue", Arial',
    },
});

export default theme;