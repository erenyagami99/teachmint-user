import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Popup from "../components/Popup";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = location.state || {};

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currentTime, setCurrentTime] = useState(null);
  const timeId = useRef(null);
  const [isTime, setIsTime] = useState(false);
  const [modal, setModal] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    const getUserTimeZone = () => {
      const userTimeZone = moment.tz.guess();
      const timeZoneMap = {
        "Asia/Calcutta": "Asia/Kolkata",
      };
      const mappedTimeZone = timeZoneMap[userTimeZone] || userTimeZone;
      setSelectedCountry(mappedTimeZone);
    };

    fetchCountries();
    getUserTimeZone();
  }, []);

  useEffect(() => {
    const regionTime = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/${selectedCountry}`
        );
        const data = await response.json();
        setCurrentTime(data.datetime);
      } catch (error) {
        console.log("Error fetching time:", error);
      }
    };
    if (selectedCountry) {
      regionTime();
    }
  }, [selectedCountry]);

  const timeRunning = useCallback(() => {
    timeId.current = setInterval(() => {
      setCurrentTime(moment(currentTime).tz(selectedCountry).add(1, "s"));
    }, 1000);
  }, [currentTime, selectedCountry]);

  useEffect(() => {
    timeRunning();
    return () => clearInterval(timeId.current);
  }, [timeRunning]);

  const handlePause = () => {
    setIsTime(true);
    clearInterval(timeId.current);
  };

  const handleResume = () => {
    setIsTime(false);
    timeRunning();
  };

  return (
    <div className="profile-container">
      <div className="profile-div">
        <div className="drop-div">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="back-button"
          >
            Back
          </button>
          <select
            onChange={(e) => {
              setSelectedCountry(e.target.value);
            }}
            className="drop-down"
          >
            <option key={selectedCountry}>{selectedCountry}</option>
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
          <div className="timer">
            <h1>
              {currentTime
                ? moment(currentTime)
                    .tz(selectedCountry || "Asia/Calcutta")
                    .format("LTS")
                : "00:00:00"}
            </h1>
          </div>
          {!isTime ? (
            <button className="pause-button" onClick={handlePause}>
              Pause
            </button>
          ) : (
            <button className="pause-button" onClick={handleResume}>
              Resume
            </button>
          )}
        </div>
        <div className="user-details">
          <div className="user-div">
            <div className="half">
              <h1>
                <span>Name : </span>
                {user.name}
              </h1>
            </div>
            <div className="address">
              <h1>
                <span>Address : &nbsp;&nbsp;</span>
              </h1>
              <div>
                <p>{user.address.city}</p>
                <p>{user.address.street}</p>
                <p>{user.address.suite}</p>
                <p>{user.address.zipcode}</p>
              </div>
            </div>
          </div>
          <div className="user-div">
            <div className="half">
              <h1>
                <span>Username: </span>
                {user.username}
              </h1>
              <h1>
                <span>Catchphrase:</span> {user.company.catchPhrase}
              </h1>
            </div>
            <div className="half">
              <h1>
                <span>Email:</span>
                {user.email}
              </h1>
              <h1>
                <span>Phone:</span>
                {user.phone}
              </h1>
            </div>
          </div>
        </div>
        <div className="posts-div">
          {user.posts.map((post) => (
            <div
              onClick={() => {
                setModal(true);
                setPost(post);
              }}
              className="post-card"
            >
              <h1>
                {post.title.length > 15
                  ? post.title.slice(0, 15) + "..."
                  : post.title}
              </h1>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>
      {modal && <Popup setModal={setModal} post={post} />}
    </div>
  );
};

export default ProfileDetails;
