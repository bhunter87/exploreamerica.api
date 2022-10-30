import { useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
} from "@chakra-ui/react";

import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const YELP_API_KEY =
    "XSOGLrnSroXBKQ3cHwnE1TTL_TgFd-x0ZIlHTev9QqbvY3_hyeX4ulYosaQ4I6m7qbYIMJn3kxRrWtbgI80ypIvBEvgCwJqJ6bnLKzROHqfmrUS0-qeVfgaSOuhEY3Yx";
const YELP_CLIENT_ID = "RyIubIxh02-6H1kH1bBVsA";
const NPS_API_KEY = "BzJoOvMfcKIO72yb1OBWGfY6A2x4BLt7e5xQouCL";
const MAP_API_KEY = "AIzaSyBr2e34qryWOxc5VrAO6xfod2SboB6mhhc";
const API_LOADER_DATA = {
    // libraries: ["places"],
    googleMapsApiKey: MAP_API_KEY,
};
function App() {
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [position, setPosition] = useState({ lat: 0, lng: 0 });
    const [markers, setMarkers] = useState([]);
    const [timingTest, setTimingTest] = useState(false);
    const { isLoaded } = useJsApiLoader(API_LOADER_DATA);
    const factor = 0.621371;
    const [thisDestinationBeer, setThisDestinationBeer] = useState({});
    const [thisDestinationObject, setThisDestinationObject] = useState({});
    const [thisDestinationLatLng, setThisDestinationLatLng] = useState({
        lat: 0,
        lng: 0,
    });

    const metersToMiles = (meters) => {
        return kmToMiles(meters * 0.0001);
    };
    const milesToMeters = (miles) => {
        return miles * 1609.344;
    };
    const kmToMiles = (km) => {
        return km * factor;
    };
    const milesToKm = (miles) => {
        return miles / factor;
    };
    // calculateRoute();
    useEffect(() => {
        // CHANGED POSITION HERE TO TEST FR OTHER LOCATIONS

        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            // SHOULD BE "position" below
            let myPosition = { lat: lat, lng: lng };
            setPosition(myPosition);
            calculateRoute();
        });
    }, [timingTest]);

    const theFunction = () => {
        axios.get("http://127.0.0.1:3306/test/function", (e) => {
            console.log(e);
        });
    };

    const arePointsNear = (checkPoint, centerPoint, km) => {
        console.log(checkPoint);
        console.log(centerPoint);

        var ky = 40000 / 360;
        var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        console.log(Math.sqrt(dx * dx + dy * dy) <= km);

        return Math.sqrt(dx * dx + dy * dy) <= km;
    };

    // const GetABeer = (destination) => {
    //     const send = (requestOptions) => {
    //         const combinedOptions = Object.assign(
    //             {},
    //             requestOptions,
    //             this.options
    //         );
    //         return _send(combinedOptions);
    //     };
    // };

    // takes 2 latLng inputs and returns the miles apart the two points are
    const getDistance = (currentPosition, destination) => {
        const R = 6371e3; // metres
        const φ1 = (currentPosition.lat * Math.PI) / 180; // φ, λ in radians
        const φ2 = (destination.lat * Math.PI) / 180;
        const Δφ = ((destination.lat - currentPosition.lat) * Math.PI) / 180;
        const Δλ = ((destination.lng - currentPosition.lng) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres

        return metersToMiles(d);
    };

    const getClosestCamping = async () => {
        let closestDestination = {};
        let destinationObjectArray = [];
        axios
            .get(
                `https://developer.nps.gov/api/v1/parks?limit=500&api_key=BzJoOvMfcKIO72yb1OBWGfY6A2x4BLt7e5xQouCL`
            )
            .then((res) => {
                let tempMinDistance = Infinity;
                res.data.data.forEach((park) => {
                    let newLatLng = {
                        lat: parseFloat(park.latitude),
                        lng: parseFloat(park.longitude),
                    };

                    if (getDistance(position, newLatLng) < tempMinDistance) {
                        tempMinDistance = getDistance(position, newLatLng);
                        closestDestination = newLatLng;
                        destinationObjectArray.push(park);
                    }
                });
            })
            .then(() => {
                setThisDestinationObject(
                    destinationObjectArray[destinationObjectArray.length - 1]
                );
                setThisDestinationLatLng(closestDestination);
                setTimingTest(true);
            });
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
        console.log("this is chosen destinatino", thisDestinationObject);

        const results = await directionsService.route({
            origin: position,
            destination:
                thisDestinationObject.addresses[0].line1 +
                ", " +
                thisDestinationObject.addresses[0].city +
                ", " +
                thisDestinationObject.addresses[0].stateCode +
                " " +
                thisDestinationObject.addresses[0].postalCode,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
        console.log("here are the markers inside ", markers);
    }

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance("");
        setDuration("");
    }

    if (!isLoaded) {
        return <SkeletonText />;
    }
    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
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
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
            </Box>
            <Box
                p={4}
                borderRadius="lg"
                m={4}
                bgColor="white"
                shadow="base"
                minW="container.md"
                zIndex="1"
            >
                <HStack spacing={2} justifyContent="space-between">
                    <Box flexGrow={1} position="relative" alignItems="center">
                        {timingTest
                            ? `Your closest National Park is :
                        ${thisDestinationObject.fullName}`
                            : "Click to take an Adventure!"}
                    </Box>

                    <ButtonGroup>
                        <Button
                            colorScheme="green"
                            type="submit"
                            onClick={getClosestCamping}
                        >
                            Calculate Route
                        </Button>
                        <Button
                            colorScheme="green"
                            type="submit"
                            onClick={theFunction}
                        >
                            Run the function
                        </Button>
                        <IconButton
                            aria-label="center back"
                            onClick={clearRoute}
                        />
                    </ButtonGroup>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent="space-between">
                    <Text>Distance: {distance} </Text>
                    <Text>Duration: {duration} </Text>
                    <IconButton
                        aria-label="center back"
                        isRound
                        onClick={() => {
                            map.panTo(position);
                            map.setZoom(15);
                        }}
                    />
                </HStack>
            </Box>
        </Flex>
    );
}
export default App;
