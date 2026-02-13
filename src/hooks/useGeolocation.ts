import { useState, useEffect } from 'react';
import type { Location } from '../types';

interface GeolocationState {
    location: Location | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation(enabled: boolean = true) {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        loading: false,
    });

    useEffect(() => {
        if (!enabled) {
            setState({ location: null, error: null, loading: false });
            return;
        }

        setState(s => ({ ...s, loading: true }));

        if (!navigator.geolocation) {
            setState(s => ({ ...s, error: 'Geolocation is not supported', loading: false }));
            return;
        }

        const success = (position: GeolocationPosition) => {
            setState({
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                error: null,
                loading: false,
            });
        };

        const error = (error: GeolocationPositionError) => {
            setState(s => ({ ...s, error: error.message, loading: false }));
        };

        const watcher = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, [enabled]);

    return state;
}
