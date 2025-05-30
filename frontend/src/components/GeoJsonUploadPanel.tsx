// frontend/src/components/GeoJsonUploadPanel.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextareaAutosize,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { toast } from "react-toastify";
import Paper from "@/components/Paper";

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
  const [pastedGeoJson, setPastedGeoJson] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processGeoJson = (json: any) => {
    let geometry = json;

    if (json.type === "FeatureCollection" && json.features?.length > 0) {
      const polygonFeature = json.features.find(
        (feature: any) => feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon"
      );

      if (polygonFeature) {
        geometry = polygonFeature.geometry;
      } else {
        toast.error("No Polygon or MultiPolygon features found in GeoJSON");
        return false;
      }
    } else if (json.type === "Feature") {
      geometry = json.geometry;
    }

    if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type)) {
      toast.error("Only Polygon or MultiPolygon GeoJSON supported");
      return false;
    }

    setGeojson(geometry);
    toast.success("GeoJSON loaded successfully!");
    return true;
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        processGeoJson(json);
      } catch (error: any) {
        toast.error(`Invalid GeoJSON file: ${error.message}`);
      }
    };

    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    setIsProcessing(true);

    if (!pastedGeoJson.trim()) {
      toast.error("Please enter GeoJSON code");
      setIsProcessing(false);
      return;
    }

    try {
      const json = JSON.parse(pastedGeoJson);
      if (processGeoJson(json)) {
        closeModal();
      }
    } catch (error: any) {
      toast.error(`Invalid GeoJSON: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPastedGeoJson("");
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
    <Paper appTheme={appTheme} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
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
          disabled={loading || !hasGeojson}
          onClick={onSearch}
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

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            onClick={openModal}
            variant="outlined"
            sx={{
              ml: { xs: "10px", sm: 0 },
              mb: { xs: "10px", sm: 0 },
              width: { xs: "100%", sm: "auto" },
              borderColor: appTheme.palette.icon.hoverColor,
              color: appTheme.palette.main.textColor,
              "&:hover": {
                borderColor: appTheme.palette.icon.selectedColor,
              },
            }}
          >
            Paste GeoJSON
          </Button>

          <Button
            onClick={onClear}
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: "auto" },
              ml: { xs: "10px", sm: 1 },
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
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: appTheme.palette.card.bgColor,
            color: appTheme.palette.main.textColor,
          },
        }}
      >
        <DialogTitle sx={{ color: appTheme.palette.main.textColor }}>Paste GeoJSON Code</DialogTitle>

        <DialogContent>
          <TextareaAutosize
            value={pastedGeoJson}
            onChange={(e) => setPastedGeoJson(e.target.value)}
            placeholder={`Paste GeoJSON here (Polygon/MultiPolygon)\nExample: {\n  "type": "Polygon",\n  "coordinates": [\n    [\n      [longitude, latitude],\n      [longitude, latitude],\n      [longitude, latitude]\n    ]\n  ]\n}`}
            minRows={10}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              color: appTheme.palette.main.textColor,
              border: `1px solid ${appTheme.palette.card.headTextColor}`,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              marginTop: "8px",
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} sx={{ color: appTheme.palette.main.textColor }}>
            Cancel
          </Button>

          <Button
            disabled={isProcessing}
            onClick={handlePasteSubmit}
            variant="contained"
            sx={{
              backgroundColor: appTheme.palette.button.bgColor,
              color: appTheme.palette.button.textColor,
              "&:hover": {
                backgroundColor: appTheme.palette.button.bgHoverColor,
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            {isProcessing ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={20} sx={{ color: "inherit", mr: 1 }} />
                Processing...
              </Box>
            ) : (
              "Load GeoJSON"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GeoJsonUploadPanel;
