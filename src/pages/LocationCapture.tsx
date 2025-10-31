import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import { toast } from "sonner";

// Default fallback location (New Delhi, India)
const FALLBACK_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090,
};

const GEOLOCATION_TIMEOUT = 10000; // 10 seconds

const LocationCapture = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      handleLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setIsLoading(false);
        toast.success("Location captured successfully!");
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate("/form", { state: { location: coords, isFallback: false } });
        }, 2000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        handleLocationError(error.message);
      },
      {
        timeout: GEOLOCATION_TIMEOUT,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  const handleLocationError = (errorMessage: string) => {
    setError(errorMessage);
    setIsFallback(true);
    setLocation(FALLBACK_LOCATION);
    setIsLoading(false);
    toast.error("Using fallback location (New Delhi, India)");
    
    // Auto-redirect after 3 seconds even with fallback
    setTimeout(() => {
      navigate("/form", { state: { location: FALLBACK_LOCATION, isFallback: true } });
    }, 3000);
  };

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      handleLocationError("Geolocation is not supported by your browser");
      return;
    }

    // Try to get permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          requestLocation();
        } else if (result.state === "prompt") {
          setShowPermissionModal(true);
          setIsLoading(false);
        } else {
          setShowPermissionModal(true);
          setIsLoading(false);
        }
      }).catch(() => {
        // If permissions API fails, just try to get location
        requestLocation();
      });
    } else {
      // If permissions API not supported, just try to get location
      requestLocation();
    }
  }, []);

  const handlePermissionRequest = () => {
    setShowPermissionModal(false);
    requestLocation();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-medium)] border border-border">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Location Capture</h1>
            <p className="text-muted-foreground">
              We're capturing your current location for a better experience
            </p>
          </div>

          <div className="space-y-6">
            {isLoading && (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-muted-foreground">Detecting your location...</p>
              </div>
            )}

            {location && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  {isFallback ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>

                {isFallback && error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-destructive font-medium">Location Error</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Using default location (New Delhi, India)
                    </p>
                  </div>
                )}

                <div className="bg-muted rounded-lg p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Latitude:</span>
                    <span className="text-lg font-semibold text-foreground">
                      {location.latitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Longitude:</span>
                    <span className="text-lg font-semibold text-foreground">
                      {location.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Redirecting to form page...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onRequestPermission={handlePermissionRequest}
      />
    </div>
  );
};

export default LocationCapture;
