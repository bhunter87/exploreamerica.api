import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Loading from "../Loading/Loading";

import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";
import "../componentStyling.css";
const NPS_API_KEY = process.env.NPS_API_KEY;
const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;
const API_LOADER_DATA = {
    libraries: process.env.LIBRARIES,
    googleMapsApiKey: MAP_API_KEY,
};
const StateParks = () => {
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [position, setPosition] = useState({ lat: 0, lng: 0 });
    const [timingTest, setTimingTest] = useState(false);
    const { isLoaded } = useJsApiLoader(API_LOADER_DATA);
    const [thisDestinationBeer, setThisDestinationBeer] = useState({});
    const [thisDestinationObject, setThisDestinationObject] = useState({});
    const [ready, setReady] = useState(false);
    const [called, setCalled] = useState(false);
    // const isLoaded = true;
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            // SHOULD BE "position" below
            let myPosition = { lat: lat, lng: lng };
            setPosition(myPosition);
            const config = {
                headers: { "Access-Control-Allow-Origin": true },
            };
            if (!timingTest) {
                axios
                    .get(
                        `http://localhost:5111/api/v1.0/StatePark?count=5&lat=${myPosition.lat}&lng=${myPosition.lng}&radiusInMiles=1000`,
                        config
                    )
                    .then((e) => {
                        console.log("THIS IS E", e);
                        setThisDestinationObject(e.data[0]);
                        setTimingTest(true);
                    });
            } else {
                let query = thisDestinationObject.name;
                const configuration = {
                    method: "get",
                    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=formatted_address%2Cname%2Cplace_id%2Cgeometry&key=${MAP_API_KEY}`,
                    headers: { "Access-Control-Allow-Origin": true },
                    mode: "cors",
                };
                let request = {
                    query: thisDestinationObject.name,
                    fields: ["name", "place_id"],
                };
                if (timingTest && isLoaded) {
                    calculateRoute();
                    setReady(true);
                    if (!called) {
                        // googleCall(configuration);
                        setCalled(true);
                    }
                }
            }
        });
    }, [isLoaded, timingTest]);

    const googleCall = async (configuration) => {
        console.log("CONFIG", configuration);
        // await axios(configuration)
        //     .then(function (response) {
        //         console.log("RESPONSE!!!!!!", response);
        //         // let data = response.data;
        //         // return data.candidates[0];
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // console.log("jsdfhjldsahfjhdsaljfkhsa", parkData);

        // console.log("config in google call", configuration);
        // // eslint-disable-next-line no-undef
        // infowindow = new google.maps.InfoWindow();
        // // eslint-disable-next-line no-undef
        // var service = new google.maps.places.PlacesService(map);
        // //     .then((data) => console.log("CHING CHING", data));
        // service.findPlaceFromQuery(configuration, function (results, status) {
        //     // eslint-disable-next-line no-undef
        //     if (status === google.maps.places.PlacesServiceStatus.OK) {
        //         console.log("RESULTS", results);
        //         // for (var i = 0; i < results.length; i++) {
        //         //     createMarker(results[i]);
        //         // }
        //         // map.setCenter(results[0].geometry.location);
        //     }
        // });
    };

    const getClosestStatePark = async () => {
        let closestDestination = {};
        let destinationObjectArray = [];
    };

    async function calculateRoute() {
        if (
            thisDestinationObject === {} ||
            thisDestinationObject === undefined ||
            thisDestinationObject === null
        ) {
            console.log("thisDestinationObject in calculteRoute fuct is bad");
            return;
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        console.log("INSIDE CALC ROOT", thisDestinationObject);
        const results = await directionsService.route({
            origin: position,
            destination:
                thisDestinationObject.location.lat +
                "," +
                thisDestinationObject.location.lng,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
    }

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance("");
        setDuration("");
    }

    // document.body.style.backgroundImage = `url(${require("../HomePage/mountains.png")})`;
    // document.body.style.backgroundSize = "cover";

    if (!ready || !isLoaded || !timingTest) {
        return <Loading />;
    }
    return (
        <>
            <img class="bg" src="mountains.png" alt="" />
            <Flex
                position="relative"
                flexDirection="column"
                alignItems="left"
                h="75vh"
                w="75vw"
                margin="auto"
            >
                <div className="mapPageHeader ml-0 fixed">
                    <Link to="/">
                        <button className="mt-4">Home</button>
                    </Link>

                    <svg viewBox="0 0 220 30">
                        <text x="37" y="17">
                            Next Stop... Adventure!
                        </text>
                        <text className="tester" x="62" y="27">
                            {thisDestinationObject.name}
                        </text>
                    </svg>
                </div>
                <Box position="absolute" h="100%" w="100%" className="mapBox">
                    {/* Google Map Box */}
                    <GoogleMap
                        center={position}
                        zoom={15}
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                        onLoad={(map) => setMap(map)}
                    >
                        <Marker position={position} />

                        {directionsResponse && (
                            <DirectionsRenderer
                                directions={directionsResponse}
                            />
                        )}
                    </GoogleMap>
                </Box>
            </Flex>
        </>
    );
};
export default StateParks;
