// frontend/src/components/AoiDetailsCard.tsx

import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";

interface AoiDetailsCardProps {
  selectedAoi: any;
  onRemove: () => void;
  onBackToList: () => void;
  appTheme: any;
}

const AoiDetailsCard = ({ selectedAoi, onRemove, onBackToList, appTheme }: AoiDetailsCardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{ width: "100%", p: 2, borderRadius: 2, backgroundColor: appTheme.palette.card.bgColor, height: "100%" }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 1, color: appTheme.palette.main.textColor }}
      >
        Area of Interest
      </Typography>

      <Button size="small" onClick={onBackToList} sx={{ color: appTheme.palette.main.textColor, mb: 1 }}>
        ← Back to list
      </Button>

      <Box>
        <Typography variant="body1" sx={{ color: appTheme.palette.main.textColor, mb: 2 }}>
          You have loaded an Area of Interest (AOI) on the map.
        </Typography>
        <Button
          onClick={onRemove}
          variant="contained"
          sx={{
            backgroundColor: appTheme.palette.button.bgColor,
            color: appTheme.palette.button.textColor,
            "&:hover": {
              backgroundColor: appTheme.palette.button.bgHoverColor,
            },
          }}
        >
          Remove AOI
        </Button>
      </Box>
    </Paper>
  );
};

export default AoiDetailsCard;
