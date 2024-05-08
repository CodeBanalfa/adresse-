import React, { useState, useEffect } from "react";
import { DrawingManager, Marker, GoogleMap } from "@react-google-maps/api";
import { Card, CardContent, Typography } from "@mui/material";
import { Wrapper } from "@googlemaps/react-wrapper";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const googleMapsApiKey = "AIzaSyCYfENzzKetiOcxrv7ucMPvPMocVziUlp8"; // Remplacez par votre clé Google Maps

// Fonction de rendu pour l'état de chargement de Google Maps
const render = (status: string) => {
  return <Typography variant="h6">{status}</Typography>;
};

const Map: React.FC = () => {
  const [googleLoaded, setGoogleLoaded] = useState<boolean>(false);
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [totalArea, setTotalArea] = useState<number | null>(0);

  // Utilisation de l'effet pour vérifier si Google Maps est chargé
  useEffect(() => {
    if (typeof window.google !== "undefined" && window.google.maps) {
      setGoogleLoaded(true);
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (googleLoaded && event.latLng) {
      const newPoint = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setPoints([...points, newPoint]);
    }
  };

  const calculateArea = (polygonPath: google.maps.LatLngLiteral[]) => {
    if (googleLoaded && window.google?.maps?.geometry) {
      return window.google.maps.geometry.spherical.computeArea(
        polygonPath.map(
          (point) => new window.google.maps.LatLng(point.lat, point.lng)
        )
      );
    }
    return null;
  };

  return (
    <Card style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", margin: "20px" }}>
      <CardContent>
        <Typography variant="h5">
          Google Maps pour Mesure de Dimensions
        </Typography>

        <Wrapper
          apiKey={googleMapsApiKey}
          render={render}
          libraries={["drawing", "geometry"]}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={12}
            onClick={handleMapClick}
          >
            {googleLoaded &&
              points.map((point, index) => (
                <Marker key={index} position={point} />
              ))}

            {googleLoaded && (
              <DrawingManager
                onPolygonComplete={(polygon) => {
                  const path = polygon
                    .getPath()
                    .getArray()
                    .map((latLng) => ({
                      lat: latLng.lat(),
                      lng: latLng.lng(),
                    }));

                  const newArea = calculateArea(path);
                  if (newArea !== null) {
                    setTotalArea((totalArea ?? 0) + newArea);
                  }
                }}
              />
            )}
          </GoogleMap>
        </Wrapper>

        {totalArea !== null && (
          <Typography variant="body1">
            Surface du polygone : {(totalArea / 10_000).toFixed(2)} hectares
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
