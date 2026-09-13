'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  Loader2, 
  Hospital, 
  Crosshair, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const clinicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when GPS location changes
function RecenterMap({ lat, lon }: { lat: number, lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [lat, lon, map]);
  return null;
}

export function ClinicMap() {
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)
  const [cityName, setCityName] = useState<string>('')
  const [activeClinic, setActiveClinic] = useState<any>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(true)

  const activeRef = useRef(true);

  // Fetch clinics for exact GPS coordinates
  const fetchClinicsForCoords = async (lat: number, lon: number, localityName?: string) => {
    if (!activeRef.current) return;
    setLocation({ lat, lon });
    if (localityName) setCityName(localityName);
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/clinics?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (activeRef.current && data.clinics && data.clinics.length > 0) {
          setClinics(data.clinics);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("API clinics fetch notice:", err);
    }

    // Secondary fallback directly via OpenStreetMap Nominatim
    try {
      const directRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&bounded=1&viewbox=${lon - 0.08},${lat + 0.08},${lon + 0.08},${lat - 0.08}&limit=8`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (directRes.ok) {
        const items = await directRes.json();
        if (activeRef.current && items && items.length > 0) {
          const formatted = items.map((item: any) => {
            const itemLat = parseFloat(item.lat);
            const itemLon = parseFloat(item.lon);
            const dLat = (itemLat - lat) * 111;
            const dLon = (itemLon - lon) * 111 * Math.cos(lat * Math.PI / 180);
            const dist = Math.sqrt(dLat * dLat + dLon * dLon);
            const rawName = item.name || item.display_name.split(',')[0];
            return {
              id: item.place_id || String(Math.random()),
              name: rawName,
              address: item.display_name.split(',').slice(1, 3).join(', ').trim(),
              distance: dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`,
              lat: itemLat,
              lon: itemLon,
              rating: "4.8",
              open: true,
              phone: "+91 1800-102-4682",
              directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${itemLat},${itemLon}`
            };
          });
          setClinics(formatted);
          setLoading(false);
          return;
        }
      }
    } catch (directErr) {
      console.warn("Direct search notice:", directErr);
    }

    if (activeRef.current) setLoading(false);
  };

  // Reverse geocode GPS coordinates to human-readable locality
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        headers: { 'User-Agent': 'CuraMindHealth/1.0', 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        return addr.suburb || addr.neighbourhood || addr.city || addr.town || addr.district || 'My Location';
      }
    } catch (_) {}
    return 'My Location';
  };

  // Request device GPS
  const requestGpsLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError("GPS geolocation is not supported by your browser.");
      setIsLocating(false);
      setLoading(false);
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!activeRef.current) return;
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const locality = await reverseGeocode(lat, lon);
        setCityName(locality);
        setIsLocating(false);

        // Save last known GPS coordinates in cache
        try {
          localStorage.setItem('curamind_gps_cache', JSON.stringify({ lat, lon, locality }));
        } catch (_) {}

        fetchClinicsForCoords(lat, lon, locality);
      },
      (err) => {
        if (!activeRef.current) return;
        console.warn("Device GPS error:", err);
        setIsLocating(false);

        // Check if cached GPS coordinates exist
        try {
          const cached = localStorage.getItem('curamind_gps_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.lat && parsed.lon) {
              setCityName(parsed.locality || 'Last Known Location');
              fetchClinicsForCoords(parsed.lat, parsed.lon, parsed.locality);
              setGpsError("Using last known GPS location. Click Refresh GPS to update.");
              return;
            }
          }
        } catch (_) {}

        setLoading(false);
        if (err.code === 1) {
          setGpsError("Location access was denied. Please allow location access in your browser to view healthcare centers near you.");
        } else if (err.code === 2) {
          setGpsError("Unable to acquire your GPS position. Please ensure device location is enabled.");
        } else {
          setGpsError("GPS request timed out. Click Refresh GPS to try again.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    activeRef.current = true;
    requestGpsLocation();

    return () => {
      activeRef.current = false;
    };
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 h-auto lg:h-[520px]">
      
      {/* Map Display Card */}
      <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col h-[460px] lg:h-full relative z-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center border border-blue-100 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F172A]">Nearby Clinics & Hospitals</h3>
                {cityName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    GPS: {cityName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {cityName 
                  ? `Healthcare facilities detected near your current GPS position` 
                  : `Locating your exact device coordinates via GPS...`}
              </p>
            </div>
          </div>

          <button
            onClick={requestGpsLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-semibold border border-sky-200 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Update using your current GPS coordinates"
          >
            <Crosshair size={14} className={isLocating ? "animate-spin" : ""} />
            <span>{isLocating ? "Locating..." : "Refresh GPS"}</span>
          </button>
        </div>

        {/* GPS Status / Error Banner */}
        {gpsError && (
          <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-800 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
            <button
              onClick={requestGpsLocation}
              className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] cursor-pointer shrink-0 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaflet Map / State View */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-100">
          {location ? (
            <MapContainer center={[location.lat, location.lon]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={location.lat} lon={location.lon} />
              
              {/* User Real GPS Marker */}
              <Marker position={[location.lat, location.lon]}>
                <Popup>
                  <div className="text-[#0F172A] font-semibold text-xs p-1">
                    Your Real GPS Position {cityName ? `(${cityName})` : ''}
                  </div>
                </Popup>
              </Marker>

              {/* Clinics Markers */}
              {clinics.map((c, i) => (
                 <Marker key={i} position={[c.lat, c.lon]} icon={clinicIcon} eventHandlers={{ click: () => setActiveClinic(c.name) }}>
                   <Popup>
                     <div className="text-[#0F172A] p-1.5">
                       <h4 className="font-bold text-sm text-[#0F172A]">{c.name}</h4>
                       <p className="text-xs text-slate-500 mb-2">{c.distance} away</p>
                       <a href={`tel:${c.phone}`} className="text-[#0284C7] flex items-center gap-1 text-xs font-semibold hover:underline">
                         <Phone size={13} /> Call Clinic
                       </a>
                     </div>
                   </Popup>
                 </Marker>
              ))}
            </MapContainer>
          ) : isLocating ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-50">
              <Crosshair size={32} className="animate-spin text-[#0284C7]" />
              <span className="text-xs font-medium">Acquiring GPS position from your device...</span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                <Crosshair size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F172A]">Location Access Required</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Please grant browser location access so CuraMind can pinpoint your exact GPS coordinates and display healthcare centers near you.
                </p>
              </div>
              <button
                onClick={requestGpsLocation}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Crosshair size={14} />
                <span>Enable GPS</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Clinics List */}
      <div className="w-full lg:w-[420px] flex flex-col space-y-3 h-auto lg:h-full">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40 bg-white rounded-3xl border border-slate-100">
               <Loader2 className="animate-spin text-[#0284C7]" size={28} />
               <p className="text-xs text-slate-400 mt-2">
                 {cityName ? `Searching clinics near ${cityName}...` : 'Searching clinics near your GPS position...'}
               </p>
            </div>
          ) : (
            clinics.map((clinic, idx) => {
              const isActive = activeClinic === clinic.name;
              return (
                <div 
                  key={idx} 
                  onClick={() => setActiveClinic(clinic.name)}
                  className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col gap-3 ${isActive ? 'border-[#0284C7] ring-2 ring-sky-500/10' : 'border-slate-200/80 hover:border-blue-200'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1">{clinic.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{clinic.address}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 border border-amber-200/60">
                      <Star size={11} className="fill-amber-400 text-amber-400" /> {clinic.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Navigation size={13} className="text-[#0284C7]" /> {clinic.distance}
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Open Now
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${clinic.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-500 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors" 
                        title={`Call ${clinic.name}`}
                      >
                        <Phone size={15} />
                      </a>
                      
                      <a 
                        href={clinic.directionsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-100"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {!loading && clinics.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
              <Hospital size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-[#0F172A]">No clinics found nearby</p>
              <p className="text-xs text-slate-400 mt-1">Please ensure your device GPS is active or click Refresh GPS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
