import {
  AppBar,
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Transactions", path: "/transactions" },
  { label: "Assets", path: "/assets" },
  { label: "Settings", path: "/settings" }
];

export function AppLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6">Portfolio Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: 220, [`& .MuiDrawer-paper`]: { width: 220 } }}>
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
