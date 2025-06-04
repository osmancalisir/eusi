// frontend/src/components/SearchResultsPanel.tsx

import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box, CircularProgress } from "@mui/material";
import { SatelliteImage } from "@/lib/types";

interface SearchResultsPanelProps {
  images: SatelliteImage[];
  geojson: any;
  // eslint-disable-next-line no-unused-vars
  setSelectedImage: (image: SatelliteImage) => void;
  appTheme: any;
  loading?: boolean;
  maxHeight?: number | string;
}

const SearchResultsPanel = ({
  images,
  geojson,
  setSelectedImage,
  appTheme,
  loading = false,
  maxHeight = 200,
}: SearchResultsPanelProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 2,
        backgroundColor: appTheme.palette.card.bgColor,
        height: "30%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color: appTheme.palette.main.textColor,
          flexShrink: 0,
        }}
      >
        Search Results {loading ? "" : `(${images.length})`}
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 200,
          }}
        >
          <CircularProgress size={24} sx={{ color: appTheme.palette.button.bgColor }} />
        </Box>
      ) : images.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 200,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              py: 4,
              color: appTheme.palette.main.textColor,
            }}
          >
            {geojson ? "No images found. Try a different area." : "Upload GeoJSON to search for satellite images"}
          </Typography>
        </Box>
      ) : (
        <List
          sx={{
            overflow: "auto",
            maxHeight: maxHeight,
            flex: 1,
            py: 0,
          }}
        >
          {images.map((image) => (
            <ListItem
              key={image.catalogID}
              sx={{
                borderBottom: "1px solid",
                borderColor: appTheme.palette.icon.hoverColor,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: appTheme.palette.input.bgHoverColor,
                },
              }}
              onClick={() => setSelectedImage(image)}
            >
              <ListItemText
                primary={image.catalogID}
                secondary={`${new Date(image.acquisitionDateStart).toLocaleDateString()} | ${image.resolution}m | ${image.cloudCoverage}% clouds`}
                primaryTypographyProps={{
                  fontWeight: "medium",
                  color: appTheme.palette.card.headTextColor,
                }}
                secondaryTypographyProps={{
                  color: appTheme.palette.main.textColor,
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default SearchResultsPanel;
