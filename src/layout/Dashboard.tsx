import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Footer from "./Footer.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import type {MenuItemProps} from "../types.ts";
import HomeIcon from '@mui/icons-material/Map';
import FolderIcon from '@mui/icons-material/Folder';
import CropIcon from '@mui/icons-material/Crop';


//https://mui.com/material-ui/react-drawer/#permanent-drawer

const Dashboard =   ()=> {
    const drawerWidth = 250;

    const menuItems: MenuItemProps[] = [
        { label: 'Αρχική', icon: <HomeIcon />, path: '/' },
        { label: 'Επεξεργασία Τοπογραφικών', icon: <CropIcon />, path: '/cropper' },
        { label: 'Μελέτες', icon: <FolderIcon />, path: '/projects' },
        { label: 'Διαχείριση Χρηστών', icon: <FolderIcon />, path: '/users' }
    ];

    const navigate = useNavigate();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Test
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar />
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item.path)}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />

                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Toolbar />
                    <div className="container mx-auto pt-24">
                        <Outlet/>
                    </div>
                </Box>
            </Box>
            <Box sx={{ ml: `${drawerWidth}px` }}>
                <Footer />
            </Box>
        </Box>
    )
}

export default  Dashboard;
