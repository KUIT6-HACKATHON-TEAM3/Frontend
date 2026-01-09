import { create } from "zustand";
import type { LatLng } from "../data/all_roads_walking_paths";

interface UserLocation {
    location: LatLng;
    setLocation: (location: LatLng) => void;
}

const initialState: LatLng = {
    lat: 37.5408, lng: 127.0793
}

const useUserLocationStore = create<UserLocation>((set) => ({
    location: initialState,
    setLocation: (newLocation) => { set({location: newLocation}) }

}))

export default useUserLocationStore;