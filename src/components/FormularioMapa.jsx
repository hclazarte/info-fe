import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
};

const FormularioMapa = ({ latitud, longitud }) => {
  const center = {
    lat: parseFloat(latitud),
    lng: parseFloat(longitud),
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default FormularioMapa;
