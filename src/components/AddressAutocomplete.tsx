import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export const AddressAutocomplete = ({ value, onChange, error }: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current || !window.google) return;

    // Initialize autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    // Add place changed listener
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [scriptLoaded, onChange]);

  return (
    <div>
      <Label htmlFor="address">Address</Label>
      <Input
        ref={inputRef}
        id="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing address..."
        className={error ? 'border-destructive' : ''}
      />
      <p className="text-xs text-muted-foreground mt-1">Used to open Google Maps</p>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
