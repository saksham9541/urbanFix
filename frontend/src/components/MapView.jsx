import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { getAllComplaints } from '../services/api';
import { useWebSocket } from '../context/WebSocketContext';
import { RefreshCw, ExternalLink, Flame } from 'lucide-react';

const createIcon = (status) => {
  let color = 'blue';
  if (status === 'RESOLVED') color = 'green';
  else if (status === 'IN_PROGRESS') color = 'orange';
  else if (status === 'SUBMITTED') color = 'red';

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function MapView({ onTrackComplaint, refreshTrigger }) {
  const { lastComplaintEvent } = useWebSocket();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const centerPosition = [28.6250, 77.2150]; // City center

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load map complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [refreshTrigger]);

  // Synchronize live WebSocket complaint events onto GIS Map
  useEffect(() => {
    if (!lastComplaintEvent || !lastComplaintEvent.data) return;

    if (lastComplaintEvent.type === 'COMPLAINT_CREATED') {
      setComplaints((prev) => {
        if (prev.some((c) => c.id === lastComplaintEvent.data.id)) return prev;
        return [lastComplaintEvent.data, ...prev];
      });
    } else if (lastComplaintEvent.type === 'COMPLAINT_UPDATED') {
      setComplaints((prev) =>
        prev.map((c) => (c.id === lastComplaintEvent.data.id ? lastComplaintEvent.data : c))
      );
    }
  }, [lastComplaintEvent]);

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Interactive Civic Issue GIS Map</h3>
          <p className="text-xs text-slate-500">Live GPS tracking of citizen reported hazards across municipal zones</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Refresh Map Points"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> New ({complaints.filter(c => c.status === 'SUBMITTED').length})
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> In Progress ({complaints.filter(c => c.status === 'IN_PROGRESS').length})
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resolved ({complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length})
          </span>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
              showHeatmap
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Flame className={`w-3 h-3 ${showHeatmap ? 'text-white' : 'text-rose-500'}`} />
            {showHeatmap ? 'Hotspots Active' : 'Show Hotspots'}
          </button>
        </div>
      </div>

      <div className="h-[420px] w-full relative z-0">
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

          {/* Geospatial Hotspot Density Heat Rings */}
          {showHeatmap && complaints.filter(c => c.latitude && c.longitude && c.status !== 'RESOLVED' && c.status !== 'CLOSED').map(issue => (
            <Circle
              key={`heat-${issue.id}`}
              center={[issue.latitude, issue.longitude]}
              radius={issue.severity === 'CRITICAL' ? 450 : 280}
              pathOptions={{
                color: issue.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
                fillColor: issue.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
                fillOpacity: 0.35,
                weight: 1.5,
              }}
            />
          ))}
          {complaints.filter(c => c.latitude && c.longitude).map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createIcon(issue.status)}
            >
              <Popup>
                <div className="text-xs p-1 max-w-[200px] space-y-1.5">
                  <div className="font-mono font-bold text-[10px] text-sky-700">{issue.trackingNumber}</div>
                  <div className="font-bold text-slate-900 leading-snug">{issue.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">{issue.address}</div>

                  {issue.imageUrl && (
                    <div className="h-20 w-full rounded overflow-hidden">
                      <img src={issue.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      issue.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : issue.status === 'IN_PROGRESS'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {issue.status}
                    </span>

                    {onTrackComplaint && (
                      <button
                        onClick={() => onTrackComplaint(issue.trackingNumber)}
                        className="text-[10px] text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-0.5"
                      >
                        Track <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
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
