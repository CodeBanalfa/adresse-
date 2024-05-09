import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  Marker,
  GoogleMap,
  Polygon,
} from "@react-google-maps/api";
import { Card, CardContent, TextField, Typography, Box } from "@mui/material";
import { Wrapper } from "@googlemaps/react-wrapper";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const googleMapsApiKey = "AIzaSyCYfENzzKetiOcxrv7ucMPvPMocVziUlp8"; // Remplacez par votre clé Google Maps

const Map: React.FC = () => {
  const [googleLoaded, setGoogleLoaded] = useState<boolean>(false);
  const [polygons, setPolygons] = useState<google.maps.LatLngLiteral[][]>([]);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [totalArea, setTotalArea] = useState<number>(0);

  // Initialisation de Google Maps
  useEffect(() => {
    if (typeof window.google !== "undefined" && window.google.maps) {
      setGoogleLoaded(true);
    }
  }, []);

  // Gestion de l'événement de fin de dessin d'un polygone
  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

    setPolygons((prevPolygons) => [...prevPolygons, path]);

    const area = window.google.maps.geometry.spherical.computeArea(
      polygon.getPath()
    );

    setTotalArea((prevArea) => prevArea + area);
  };

  // Gestion du clic sur la carte pour ajouter des marqueurs
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    }
  };

  return (
    <Card style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", margin: "20px" }}>
      <CardContent>
        <Typography variant="h5">
          Google Maps pour Mesure de Dimensions
        </Typography>

        <Wrapper
          apiKey={googleMapsApiKey}
          render={(status) => <Typography variant="body2">{status}</Typography>}
          libraries={["drawing", "geometry"]}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={12}
            onClick={handleMapClick}
          >
            {/* Ajout des marqueurs */}
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} />
            ))}

            {/* Dessin des polygones */}
            <DrawingManager onPolygonComplete={handlePolygonComplete} />

            {/* Affichage des polygones dessinés */}
            {polygons.map((polygon, index) => (
              <Polygon key={index} paths={polygon} />
            ))}
          </GoogleMap>
        </Wrapper>

        {/* Champ pour saisir l'adresse */}
        <Box mt={2}>
          <TextField
            fullWidth
            id="adresse"
            label="Adresse"
            placeholder="Entrez l'adresse ici"
          />
        </Box>

        {/* Affichage de la surface totale */}
        <Box mt={2}>
          <TextField
            fullWidth
            id="surface"
            label="Surface totale (m²)"
            value={totalArea.toFixed(2)}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Map;
