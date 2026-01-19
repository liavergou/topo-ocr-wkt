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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Footer from "./Footer.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import type {MenuItemProps} from "@/types";
import FolderIcon from '@mui/icons-material/Folder';
import CropIcon from '@mui/icons-material/Crop';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import cflogo from "@/assets/img/cf.jpg"
import useAuth from "@/hooks/useAuth.ts";
import Home from "@mui/icons-material/Home";

const Dashboard =   ()=> {
    const drawerWidth = 'clamp(250px, 20vw, 400px)'; // Min 250px, Max 400px, Ideal 20vw

    const { userInfo:{name},logout, hasAnyRole } = useAuth();

    const menuItems: MenuItemProps[] = [
        { label: 'Αρχική', path: '/', icon: <Home /> },
        { label: 'OCR Τοπογραφικών', path: '/select-project', icon: <CropIcon /> },
        ...(hasAnyRole(['Admin', 'Manager']) ? [
            { label: 'Διαχείριση Χρηστών', path: '/users', icon: <PeopleOutlineIcon /> },
            { label: 'Διαχείριση Μελετών', path: '/projects', icon: <FolderIcon /> },
            { label: 'Διαχείριση Prompts', path: '/prompts', icon: <AutoAwesomeIcon /> },
        ] : []),
    ];

    const navigate = useNavigate();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };



    return (
        <Box className="flex flex-col min-h-screen">
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'primary.main',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ height: 125 }}>
                    <img
                        src={cflogo}
                        alt="CF Logo"
                        className="h-25 mr-16"
                    />
                    <Typography variant="h3" noWrap component="div">
                        CoordAiExtractor
                    </Typography>

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
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: '#c9cdd1',
                            color: '#083251',
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
                                            '& .MuiTypography-root': {
                                                fontWeight: 500,
                                                fontSize: '1.4rem'
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
                >
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
