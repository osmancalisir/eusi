// frontend/src/components/ImageDetailsCard.tsx

"use client";
import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import { SatelliteImage } from "@/lib/types";
import Paper from "@/components/Paper";

interface ImageDetailsCardProps {
  selectedImage: SatelliteImage;
  setSelectedImage: (image: SatelliteImage | null) => void;
  appTheme: any;
  themeMode: "light" | "dark";
  onOrderSuccess?: () => void;
}

const ImageDetailsCard = ({
  selectedImage,
  setSelectedImage,
  appTheme,
  themeMode,
  onOrderSuccess,
}: ImageDetailsCardProps) => {
  const handleOrder = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogId: selectedImage.catalogID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order failed");
      }

      toast.success("Order placed successfully!");
      onOrderSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Order failed");
    }
  };

  return (
    <Paper appTheme={appTheme} elevation={3} sx={{ width: "100%", p: 2, borderRadius: 2 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 1, color: appTheme.palette.main.textColor }}
      >
        Image Details
      </Typography>
      <Button
        onClick={() => setSelectedImage(null)}
        size="small"
        sx={{ color: appTheme.palette.main.textColor, mb: 1 }}
      >
        ← Back to list
      </Button>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 2,
          color: appTheme.palette.main.textColor,
        }}
      >
        <Typography>
          <strong>Catalog ID:</strong> {selectedImage.catalogID}
        </Typography>
        <Typography>
          <strong>Resolution:</strong> {selectedImage.resolution}m
        </Typography>
        <Typography>
          <strong>Cloud Coverage:</strong> {selectedImage.cloudCoverage}%
        </Typography>
        <Typography>
          <strong>Sensor:</strong> {selectedImage.sensor}
        </Typography>
        <Typography>
          <strong>Date:</strong> {new Date(selectedImage.acquisitionDateStart).toLocaleDateString()}
        </Typography>
      </Box>

      <Button
        onClick={handleOrder}
        variant="contained"
        fullWidth
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
        Order Image
      </Button>
    </Paper>
  );
};

export default ImageDetailsCard;
