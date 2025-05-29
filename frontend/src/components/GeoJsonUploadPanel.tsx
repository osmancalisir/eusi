// frontend/src/components/GeoJsonUploadPanel.tsx

import React from "react";
import { Paper, Box, Button, Typography, CircularProgress } from "@mui/material";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { toast } from "react-toastify";

interface GeoJsonUploadPanelProps {
  appTheme: any;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
  hasGeojson: boolean;
  setGeojson: (geojson: any) => void;
}

const GeoJsonUploadPanel = ({
  appTheme,
  onSearch,
  onClear,
  loading,
  hasGeojson,
  setGeojson,
}: GeoJsonUploadPanelProps) => {
  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);

        let geometry = json;
        if (json.type === "FeatureCollection" && json.features?.length > 0) {
          geometry = json.features[0].geometry;
        }

        if (!["Polygon", "MultiPolygon"].includes(geometry.type)) {
          toast.error("Only Polygon or MultiPolygon GeoJSON supported");
          return;
        }

        setGeojson(geometry);
        toast.success("GeoJSON loaded successfully!");
      } catch (error: any) {
        toast.error(`Invalid GeoJSON file: ${error.message}`);
      }
    };

    reader.readAsText(file);
  };

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "application/geo+json": [".geojson"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    onDrop: handleDrop,
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, backgroundColor: appTheme.palette.card.bgColor }}>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: appTheme.palette.icon.hoverColor,
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: appTheme.palette.input.bgHoverColor,
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography sx={{ color: appTheme.palette.main.textColor }}>
          Drag and drop GeoJSON file here, or click to select
        </Typography>
        <Typography variant="caption" sx={{ color: appTheme.palette.main.textColor }}>
          (Only *.geojson files will be accepted)
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          onClick={onSearch}
          disabled={loading || !hasGeojson}
          variant="contained"
          sx={{
            backgroundColor: appTheme.palette.button.bgColor,
            color: appTheme.palette.button.textColor,
            "&:hover": {
              backgroundColor: appTheme.palette.button.bgHoverColor,
            },
            "&:disabled": {
              opacity: 0.5,
              backgroundColor: appTheme.palette.icon.hoverColor,
              color: appTheme.palette.main.textColor,
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} sx={{ color: "inherit", mr: 1 }} />
              Searching...
            </Box>
          ) : (
            "Search Images"
          )}
        </Button>

        <Button
          onClick={onClear}
          variant="outlined"
          sx={{
            borderColor: appTheme.palette.icon.hoverColor,
            color: appTheme.palette.main.textColor,
            "&:hover": {
              borderColor: appTheme.palette.icon.selectedColor,
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
};

export default GeoJsonUploadPanel;
