// frontend/src/components/ImageDetailsCard.tsx

"use client";
import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import { SatelliteImage } from "@/lib/types";

interface ImageDetailsCardProps {
  selectedImage: SatelliteImage;
  setSelectedImage: (image: SatelliteImage | null) => void;
  appTheme: any;
  themeMode: "light" | "dark";
}

const ImageDetailsCard = ({ selectedImage, setSelectedImage, appTheme, themeMode }: ImageDetailsCardProps) => {
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
    } catch (error: any) {
      toast.error(error.message || "Order failed");
    }
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", p: 2, borderRadius: 2, backgroundColor: appTheme.palette.card.bgColor }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 1, color: appTheme.palette.main.textColor }}
      >
        Image Details
      </Typography>
      <Button
        size="small"
        onClick={() => setSelectedImage(null)}
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
        variant="contained"
        fullWidth
        onClick={handleOrder}
        sx={{
          backgroundColor: themeMode === "dark" ? "#002642" : "#840032",
          color: "white",
          "&:hover": {
            backgroundColor: themeMode === "dark" ? "#001a33" : "#6a0028",
          },
        }}
      >
        Order Image
      </Button>
    </Paper>
  );
};

export default ImageDetailsCard;
