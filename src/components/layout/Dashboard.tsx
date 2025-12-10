import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Footer from "./Footer.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import type {MenuItemProps} from "@/types";
import HomeIcon from '@mui/icons-material/Map';
import FolderIcon from '@mui/icons-material/Folder';
import CropIcon from '@mui/icons-material/Crop';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import cflogo from "@/assets/img/cf.jpg"
import useAuth from "@/hooks/useAuth.ts";


//https://mui.com/material-ui/react-drawer/#permanent-drawer
//https://www.youtube.com/watch?v=ZZPCXhw0WZM

const Dashboard =   ()=> {
    const drawerWidth = 'clamp(250px, 20vw, 400px)'; // Min 250px, Max 400px, Ideal 20vw

    // Παίρνουμε authentication info
    const { userInfo:{name},logout, hasAnyRole } = useAuth();

    const menuItems: MenuItemProps[] = [
        { label: 'Αρχική', path: '/', icon: <HomeIcon /> },
        { label: 'OCR Τοπογραφικών', path: '/select-project', icon: <CropIcon /> },

        // Conditional rendering - μόνο Admin/Manager βλέπουν αυτό το menu
        ...(hasAnyRole(['Admin', 'Manager']) ? [
            { label: 'Διαχείριση Χρηστών', path: '/users', icon: <PeopleOutlineIcon /> },
            { label: 'Διαχείριση Μελετών', path: '/projects', icon: <FolderIcon /> },
            { label: 'Διαχείριση Prompts', path: '/prompts', icon: <FolderIcon /> },
        ] : []),
    ];

    const navigate = useNavigate();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };



    return (
        // min-height όσο η οθόνη
        <Box className="flex flex-col min-h-screen">
            <CssBaseline />

            {/* APPBAR - Full Width */}
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'primary.main',
                    zIndex: (theme) => theme.zIndex.drawer + 1 //για να καθεται απο πανω
                }}
            >
                {/*Μπάρα*/}
                <Toolbar sx={{ height: 125 }}>
                    <img
                        src={cflogo}
                        alt="CF Logo"
                        className="h-25 mr-16"
                    />
                    <Typography variant="h3" noWrap component="div">
                        CoordAiExtractor
                    </Typography>

                    {/* LOGOUT */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                        <Typography variant="body2">{name}</Typography>
                        <IconButton
                            color="inherit"
                            onClick={() => logout()}
                            title="Αποσύνδεση"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>


                </Toolbar>
            </AppBar>

            <Box className="flex flex-grow">
                {/*DRAWER-SIDE BAR*/}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: '#c9cdd1',
                            color: '#272a2e',
                            marginTop: '125px'
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >

                    <List sx={{ py: 6 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ mb: 6 }}>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item.path)}>

                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            // ρυθμίσεις text μέσα στο LIST
                                            '& .MuiTypography-root': {
                                                fontWeight: 500,
                                                fontSize: '1.2rem'
                                            }
                                        }}/>

                                </ListItemButton>
                            </ListItem>


                        ))}



                    </List>


                </Drawer>
                <Box
                    component="main"
                    className="flex-grow bg-white p-2 overflow-x-hidden"
                    sx={{ width: `calc(100% - ${drawerWidth})`,marginTop: '115px' }}
                    // viewport-sidebar*************αλλιως δεν κρατάει το κεντράρισμα
                >
                    {/*Αδειο toolbar που δημιουργεί spacing*/}
                    {/*<Toolbar sx={{ height:50 }} />*/}

                    {/* Το περιεχόμενο ξεκινάει ΕΔΩ */}
                    <div className="w-full h-full ">
                        <Outlet/>
                    </div>
                </Box>
            </Box>

            <Box sx={{ ml: drawerWidth }}>
                <Footer />
            </Box>
        </Box>
    )
}

export default  Dashboard;
