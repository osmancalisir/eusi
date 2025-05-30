// frontend/src/components/Paper.tsx

import React from "react";
import { Box, BoxProps } from "@mui/material";

interface PaperProps extends BoxProps {
  appTheme: any;
  elevation?: number;
}

const Paper = ({ children, appTheme, elevation = 1, sx = {}, ...props }: PaperProps) => {
  const elevationShadows = [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)",
    "0px 3px 3px -2px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.07), 0px 1px 8px 0px rgba(0,0,0,0.06)",
    "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 8px 0px rgba(0,0,0,0.07)",
  ];

  return (
    <Box
      {...props}
      sx={{
        backgroundColor: appTheme.palette.card.bgColor,
        color: appTheme.palette.main.textColor,
        borderRadius: 2,
        boxShadow: elevationShadows[elevation] || elevationShadows[1],
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Paper;
