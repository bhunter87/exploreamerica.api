import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };

const Map = () => {
    const { map } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBr2e34qryWOxc5VrAO6xfod2SboB6mhhc",
    });

    if (!map) {
        // LOADING
        return <h1>Loading</h1>;
    }

    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="60vh"
            w="60vh"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
                <GoogleMap center={center} zoom={15}></GoogleMap>
            </Box>
        </Flex>
    );
};
