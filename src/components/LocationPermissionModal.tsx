import { AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onRequestPermission: () => void;
}

const LocationPermissionModal = ({ isOpen, onRequestPermission }: LocationPermissionModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Location Access Required</DialogTitle>
          <DialogDescription className="text-center">
            We need your location to provide you with better services. Your location data is used
            only for this session and is not stored permanently.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Click "Allow Location" below, then enable location access in your browser when prompted.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onRequestPermission} className="w-full sm:w-auto">
            <MapPin className="mr-2 h-4 w-4" />
            Allow Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionModal;
