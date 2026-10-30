"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "reown_user_location";
const ASKED = "reown_location_asked";

export const DEFAULT_LOCATION = { lat: 1.1186, lng: 104.0487, label: "Batam Centre", source: "default" };

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(DEFAULT_LOCATION);
  const [asked, setAsked] = useState(true); // true dulu supaya popup tidak berkedip

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLocationState(JSON.parse(saved));
      setAsked(localStorage.getItem(ASKED) === "1");
    } catch {}
  }, []);

  const setLocation = useCallback((loc) => {
    setLocationState(loc);
    try { localStorage.setItem(KEY, JSON.stringify(loc)); } catch {}
  }, []);

  const resetLocation = useCallback(() => setLocation(DEFAULT_LOCATION), [setLocation]);

  const markAsked = useCallback(() => {
    setAsked(true);
    try { localStorage.setItem(ASKED, "1"); } catch {}
  }, []);

  const requestGps = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("unsupported"));
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              label: "Lokasi GPS",
              source: "gps",
            };
            setLocation(loc);
            resolve(loc);
          },
          reject,
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }),
    [setLocation]
  );

  return (
    <LocationContext.Provider
      value={{ location, setLocation, resetLocation, requestGps, asked, markAsked }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useUserLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useUserLocation harus dipakai di dalam <LocationProvider>");
  return ctx;
}