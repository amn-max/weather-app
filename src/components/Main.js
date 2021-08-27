import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import "./MainStyles.css";
import axios from "axios";
import { useHistory } from "react-router";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { MdGpsFixed } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
const API_URL = "http://127.0.0.1:5000/";

const Main = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const provider = new OpenStreetMapProvider();
  const [result, setResult] = useState([]);
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const search = new GeoSearchControl({
    provider: new OpenStreetMapProvider(),
  });
  const [lat, setLat] = useState(75.57);
  const [lon, setLon] = useState(16.36);

  const currentGPSValue = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.longitude);
      setLon(position.coords.latitude);
    });
    getDataFromApi();
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      history.replace("/");
    }
    currentGPSValue();
  }, []);

  useEffect(() => {
    getDataFromApi();
  }, [lat, lon]);

  const getDataFromApi = (e) => {
    if (e) {
      e.preventDefault();
    }
    let httpLat = "?lat=" + lon;
    let httplon = "&lon=" + lat;
    axios
      .get(API_URL + httpLat + httplon)
      .then(({ data }) => {
        setWeatherData(data.list[0]);
      })
      .catch((err) => {
        setWeatherData(null);
      });
  };

  const handleSearch = async (e) => {
    setCity(e.target.value);
    const res = await provider.search({ query: city });

    setResult(res);
  };

  const ChangeMapView = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };

  const selectLocation = (location, x, y) => {
    setCity(location);
    setLat(x);
    setLon(y);
    setResult([]);
    getDataFromApi();
  };

  function DraggableMarker() {
    const [draggable, setDraggable] = useState(true);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setLat(marker.getLatLng().lng);
            setLon(marker.getLatLng().lat);
          }
        },
      }),
      []
    );
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);

    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={[lon, lat]}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span>This place is {weatherData?.main.feels}</span>
        </Popup>
      </Marker>
    );
  }

  return (
    <div className="main">
      <div className="leaflet-container">
        <MapContainer center={[lon, lat]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker />
          <ChangeMapView coords={[lon, lat]} />
        </MapContainer>
      </div>
      <div className="main__right">
        <div>
          <div>
            <h2>Weather APP</h2>
            <p>Weather Data Fetched from Python Flask API</p>
          </div>

          <div>
            <form className="btns">
              <InputGroup>
                <InputGroup.Text>Location</InputGroup.Text>
                <FormControl
                  value={city}
                  onChange={handleSearch}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
                {city.length > 0 && (
                  <div className="auto-complete">
                    <ul>
                      {result.map((res, i) => {
                        return (
                          <li
                            onClick={() =>
                              selectLocation(res?.label, res?.x, res?.y)
                            }
                            key={i}
                          >
                            {res?.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </InputGroup>
              {city.length > 0 ? (
                <div className="serach_close" onClick={() => setResult([])}>
                  <IoMdClose style={{ color: "black" }} />
                </div>
              ) : city.length == 0 ? null : null}
              <Button type="submit" variant="primary" onClick={getDataFromApi}>
                GO
              </Button>
              <Button type="submit" variant="primary" onClick={currentGPSValue}>
                <MdGpsFixed />
              </Button>
            </form>
          </div>
        </div>

        {weatherData != null ? (
          <div>
            <h2>You City Weather Data</h2>
            <div className="output">
              {weatherData.main.temp && (
                <div className="val-con">
                  <h2>{weatherData.main.temp}</h2>
                  <p>Temprature</p>
                </div>
              )}
              {weatherData.main.humidity && (
                <div className="val-con">
                  <h2>{weatherData.main.humidity}</h2>
                  <p>Humidity</p>
                </div>
              )}

              {weatherData.main.pressure && (
                <div className="val-con">
                  <h2>{weatherData.main.pressure}</h2>
                  <p>Pressure</p>
                </div>
              )}
              {weatherData.main.sea_level && (
                <div className="val-con">
                  <h2>{weatherData.main.sea_level}</h2>
                  <p>Sea Lvl</p>
                </div>
              )}

              {weatherData.main.grnd_level && (
                <div className="val-con">
                  <h2>{weatherData.main.grnd_level}</h2>
                  <p>Ground Lvl</p>
                </div>
              )}
            </div>
            <h3>According to data your city feels {weatherData.main.feels}</h3>
          </div>
        ) : city.length == 0 ? null : (
          <p>City does not exits</p>
        )}
      </div>
    </div>
  );
};

export default Main;
