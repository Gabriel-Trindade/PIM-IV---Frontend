import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    success: {
      lightest: "#F0FDF9",
      light: "#3FC79A",
      main: "#10B981",
      dark: "#0B815A",
      darkest: "#134E48",
      contrastText: "#FFFFFF",
    },
  },
});

export const CustomersSearch = () => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Pesquisar Folhas"
      onChange={(e) => onSearch(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon color="action" fontSize="small">
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      }
      sx={{ maxWidth: 500 }}
    />
    <Button type="button" variant="contained" color="success" sx={{marginLeft: 3}}>Pesquisar</Button>
  </Card>
);
