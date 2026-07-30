export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface LocationError {
    code: number;
    message: string;
}

/**
 * Get the current user's location using the Geolocation API
 * @param options - Geolocation options
 * @returns Promise resolving to coordinates or rejecting with error
 */
export function getCurrentLocation(
    options: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: 0,
                message: "Geolocation is not supported by your browser",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let message = "Unable to retrieve your location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "Location request timed out.";
                        break;
                }
                reject({
                    code: error.code,
                    message,
                });
            },
            options
        );
    });
}

/**
 * Check if geolocation is supported
 */
export function isGeolocationSupported(): boolean {
    return typeof navigator !== "undefined" && "geolocation" in navigator;
}

/**
 * Watch the user's location changes
 * @param callback - Function to call when location changes
 * @param options - Geolocation options
 * @returns Watch ID that can be used to stop watching
 */
export function watchLocation(
    callback: (coordinates: LocationCoordinates) => void,
    errorCallback?: (error: LocationError) => void,
    options: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
): number | null {
    if (!isGeolocationSupported()) {
        if (errorCallback) {
            errorCallback({
                code: 0,
                message: "Geolocation is not supported by your browser",
            });
        }
        return null;
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },
        (error) => {
            if (errorCallback) {
                let message = "Unable to retrieve your location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "Location request timed out.";
                        break;
                }
                errorCallback({
                    code: error.code,
                    message,
                });
            }
        },
        options
    );
}

/**
 * Stop watching location changes
 * @param watchId - The watch ID returned by watchLocation
 */
export function clearWatch(watchId: number | null): void {
    if (watchId !== null && isGeolocationSupported()) {
        navigator.geolocation.clearWatch(watchId);
    }
}

/**
 * Calculate distance between two coordinates in kilometers
 * Uses Haversine formula
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
