import axios from 'axios';
import config from '~/config';
import { toLower } from 'lodash';

export interface Geocoding {
    country: string;
    lat: number;
    local_names?: { [key: string]: string };
    lon: number;
    name: string;
    state: string;
}

export const keyGeocoding = (item: Geocoding) =>
    toLower([item.name, item.state, item.country].filter((v) => v).join('.'));

const filter = (geos: Geocoding[]) => {
    const r: Geocoding[] = [];

    geos.forEach((item) => {
        if (!r.find((v) => keyGeocoding(v) === keyGeocoding(item))) {
            r.push(item);
        }
    });

    // console.log('r', r);
    return r;
};
const getGeocode = (search: string) => {
    return axios.get<Geocoding[]>(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${config.openWeatherMap.apiKey}`
    );
};

const getWeather = (lat: string, lon: string) => {
    return axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.openWeatherMap.apiKey}`
    );
};
export default {
    getGeocode,
    getWeather,
    keyGeocoding,
    filter,
};
