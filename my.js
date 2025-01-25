import { useEffect, useState } from "react";
import { Room, Star } from "@mui/icons-material";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import { format } from "timeago.js";
import "./app.css";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    center: [47.040182, 17.071727],
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mapType, setMapType] = useState("standard"); // Added state for map type

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    const { lat, lng } = e.latlng;
    setNewPlace({
      lat,
      long: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const toggleMapType = () => {
    setMapType(mapType === "standard" ? "satellite" : "standard");
  };

  return (
    <div style={{ height: "95vh", width: "100%", position: "relative" }}>
      <div className="navbar">
        <div className="logo">
          <Room className="logoIcon" />
          <span>MAPPING SITE</span>
        </div>
        <div className="navButtons">
          {currentUsername ? (
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <button className="button login" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <button className="button register" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </>
          )}
          <button className="button2" onClick={toggleMapType}>
            {mapType === "standard" ? "Satellite View" : "Standard View"}
          </button>
        </div>
      </div>
      <MapContainer
        center={viewport.center}
        zoom={viewport.zoom}
        style={{ height: "calc(100% - 60px)", width: "100%" }}
        doubleClickZoom={false}
        onViewportChange={(viewport) => setViewport(viewport)}
        onClick={handleAddClick}
      >
        <TileLayer
          url={mapType === "standard" ? 
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
            "https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png"}
          attribution={mapType === "standard" ? 
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' :
            '&copy; Wikimedia'}
        />

        {pins.map((p) => (
          <Marker
            key={p._id}
            position={[p.lat, p.long]}
            onclick={() => handleMarkerClick(p._id, p.lat, p.long)}
          >
            <Popup>
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span> {/* Format createdAt date */}
              </div>
            </Popup>
          </Marker>
        ))}

        {newPlace && (
          <Marker position={[newPlace.lat, newPlace.long]}>
            <Popup>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </Popup>
          </Marker>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default App;
