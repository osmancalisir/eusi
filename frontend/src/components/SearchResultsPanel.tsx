// frontend/src/components/SearchResultsPanel.tsx

import React from "react";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import { SatelliteImage } from "@/lib/types";

interface SearchResultsPanelProps {
  images: SatelliteImage[];
  geojson: any;
  setSelectedImage: (image: SatelliteImage) => void; // eslint-disable-line no-unused-vars
  appTheme: any;
}

const SearchResultsPanel = ({ images, geojson, setSelectedImage, appTheme }: SearchResultsPanelProps) => {
  return (
    <Paper elevation={3} sx={{ width: "100%", p: 2, borderRadius: 2, backgroundColor: appTheme.palette.card.bgColor }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 2, color: appTheme.palette.main.textColor }}
      >
        Search Results ({images.length})
      </Typography>

      {images.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            py: 4,
            color: appTheme.palette.main.textColor,
          }}
        >
          {geojson ? "No images found. Try different area." : "Upload GeoJSON to search for satellite images"}
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {images.map((image) => (
            <ListItem
              /**
               * This key might create collision, a better key can be added to avoid js engine confusion.
               * One possible better key would be ${image.catalogID}-${image.acquisitionDate}
               * Since its currently works only with sample data, there is no collison with key, but should be improved
               */
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
