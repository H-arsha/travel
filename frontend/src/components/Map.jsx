import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import api from '../api';

const MapComponent = () => {
    const [unlockedStates, setUnlockedStates] = useState([]);
    const [geoData, setGeoData] = useState(null);

    const position = [22.5, 78.9629];
    const zoom = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statesRes, geoRes] = await Promise.all([
                    api.get('/users/me/states'),
                    fetch('/data/india-states.json').then(r => r.json())
                ]);
                setUnlockedStates(statesRes.data.map(s => s.state_name));
                setGeoData(geoRes);
            } catch (err) {
                console.error(err);
                // Try loading GeoJSON even if states API fails
                try {
                    const geoRes = await fetch('/data/india-states.json').then(r => r.json());
                    setGeoData(geoRes);
                } catch (e) {
                    console.error('Failed to load GeoJSON:', e);
                }
            }
        };
        fetchData();
    }, []);

    const getStyle = (feature) => {
        const isUnlocked = unlockedStates.includes(feature.properties.name);
        return {
            fillColor: isUnlocked ? '#f59e0b' : '#1e293b',
            weight: 1.5,
            opacity: 1,
            color: isUnlocked ? '#fbbf24' : '#334155',
            fillOpacity: isUnlocked ? 0.6 : 0.3,
        };
    };

    const onEachFeature = (feature, layer) => {
        const isUnlocked = unlockedStates.includes(feature.properties.name);
        const tooltipContent = `
            <div style="font-family: 'Inter', sans-serif; padding: 4px 8px;">
                <strong style="color: ${isUnlocked ? '#f59e0b' : '#94a3b8'}; font-size: 13px;">
                    ${feature.properties.name}
                </strong>
                <br/>
                <span style="color: ${isUnlocked ? '#10b981' : '#ef4444'}; font-size: 11px;">
                    ${isUnlocked ? '✦ CONQUERED' : '✧ Unconquered'}
                </span>
            </div>
        `;

        layer.bindTooltip(tooltipContent, {
            className: 'custom-tooltip',
            direction: 'top',
            sticky: true,
        });

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({
                    weight: 3,
                    fillOpacity: isUnlocked ? 0.8 : 0.5,
                    color: isUnlocked ? '#fbbf24' : '#64748b',
                });
            },
            mouseout: (e) => {
                e.target.setStyle(getStyle(feature));
            },
        });
    };

    return (
        <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            style={{ background: '#0a0e1a' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {geoData && (
                <GeoJSON
                    key={unlockedStates.join(',')}
                    data={geoData}
                    style={getStyle}
                    onEachFeature={onEachFeature}
                />
            )}
        </MapContainer>
    );
};

export default MapComponent;
