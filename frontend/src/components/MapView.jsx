import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React/Vite bundlers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const sampleIssues = [
  {
    id: 1,
    title: 'Major Pothole on Main Boulevard',
    category: 'Roads & Infrastructure',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    coords: [28.6139, 77.2090],
  },
  {
    id: 2,
    title: 'Street Light Outage - Sector 4',
    category: 'Electrical & Lighting',
    severity: 'MEDIUM',
    status: 'SUBMITTED',
    coords: [28.6250, 77.2150],
  },
  {
    id: 3,
    title: 'Overflowing Garbage Container',
    category: 'Sanitation',
    severity: 'HIGH',
    status: 'ASSIGNED',
    coords: [28.6080, 77.2010],
  }
];

export default function MapView() {
  const centerPosition = [28.6139, 77.2090]; // Default civic center

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Interactive Civic Issue Heatmap</h3>
          <p className="text-xs text-slate-500">Live GPS tracking and OpenStreetMap geospatial clustering</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> High Priority
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Medium
          </span>
        </div>
      </div>

      <div className="h-[380px] w-full relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sampleIssues.map((issue) => (
            <Marker key={issue.id} position={issue.coords} icon={customIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-slate-900 mb-1">{issue.title}</div>
                  <div className="text-slate-600 mb-1">Category: {issue.category}</div>
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                      {issue.severity}
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px]">
                      {issue.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

