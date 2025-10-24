import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'grey.800',
                color: 'white',
                p: 2,
                textAlign: 'center',
                width: '100%',
                mt: 'auto',
            }}
        >
            <Typography variant="body2">
                &copy; {new Date().getFullYear()} All rights reserved.
            </Typography>
            <Footer />
        </Box>
    );
};

export default Footer;
