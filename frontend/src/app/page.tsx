// frontend/src/app/page.tsx

"use client";
import React, { useState, useRef, useEffect } from "react";
import Map from "@/components/Map";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SatelliteImage } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";
import useAppTheme from "@/components/ThemeToggle/hook/index";
import OrderList from "@/components/OrderList";
import ImageDetailsCard from "@/components/ImageDetailsCard";
import SearchResultsPanel from "@/components/SearchResultsPanel";
import GeoJsonUploadPanel from "@/components/GeoJsonUploadPanel";
import AoiDetailsCard from "@/components/AoiDetailsCard";
import { Box, Typography, Paper } from "@mui/material";

export default function Home() {
  const [geojson, setGeojson] = useState<any>(null);
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [selectedAoi, setSelectedAoi] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  const { appTheme, themeMode, toggleTheme } = useAppTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSetGeojson = (newGeojson: any) => {
    setGeojson(newGeojson);
    setSelectedImage(null);
    setSelectedAoi(null);
  };

  const searchImages = async () => {
    if (!geojson) {
      toast.warn("Please upload a GeoJSON file first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/images/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geojson),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();
      setImages(data);
      toast.info(`Found ${data.length} images`);
    } catch (error: any) {
      toast.error(error.message || "Search failed. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGeojson(null);
    setImages([]);
    setSelectedImage(null);
    setSelectedAoi(null);
    mapRef.current?.clearFeatures();
  };

  const handleFeatureSelect = (feature: any) => {
    if (feature.type === "aoi") {
      setSelectedAoi(feature);
      setSelectedImage(null);
    } else {
      setSelectedImage(feature);
      setSelectedAoi(null);
    }
  };

  const handleBackFromAoi = () => {
    setSelectedAoi(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: appTheme.palette.main.bgColor,
        color: appTheme.palette.main.textColor,
        minHeight: "100vh",
        py: 4,
        px: { xs: 1, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: themeMode === "dark" ? "#840032" : "#002642",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
            }}
          >
            <span style={{ color: appTheme.palette.main.iconColor }}>Orbital Edge Imaging</span>
          </Typography>
          <ThemeToggle theme={themeMode} toggleTheme={toggleTheme} color={appTheme.palette.main.iconColor} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 400px",
              lg: "1.5fr 400px",
            },
            gap: 3,
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: appTheme.palette.card.bgColor,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "300px", sm: "400px", md: "auto" },
              }}
            >
              <Map ref={mapRef} geojson={geojson} onFeatureSelect={handleFeatureSelect} themeMode={themeMode} />
            </Paper>

            <GeoJsonUploadPanel
              appTheme={appTheme}
              onSearch={searchImages}
              onClear={handleClear}
              loading={loading}
              hasGeojson={!!geojson}
              setGeojson={handleSetGeojson}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flex: 1,
                minHeight: 0,
              }}
            >
              {selectedAoi ? (
                <AoiDetailsCard
                  selectedAoi={selectedAoi}
                  onRemove={handleClear}
                  appTheme={appTheme}
                  onBackToList={handleBackFromAoi}
                />
              ) : selectedImage ? (
                <ImageDetailsCard
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  appTheme={appTheme}
                  themeMode={themeMode}
                />
              ) : (
                <SearchResultsPanel
                  images={images}
                  geojson={geojson}
                  setSelectedImage={setSelectedImage}
                  appTheme={appTheme}
                />
              )}

              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: appTheme.palette.card.bgColor,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "300px",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: appTheme.palette.main.textColor,
                    position: "sticky",
                    top: 0,
                    backgroundColor: appTheme.palette.card.bgColor,
                    zIndex: 1,
                    py: 1,
                  }}
                >
                  My Orders
                </Typography>
                <Box sx={{ flex: 1, overflow: "auto" }}>{isClient && <OrderList appTheme={appTheme} />}</Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
