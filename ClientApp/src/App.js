import React from "react";
import { Route, Routes } from "react-router-dom";
// import StateParks from "./components/StateParks/StateParks";
import NationalForests from "./components/NationalForests/NationalForests";
import NationalParks from "./components/NationalParks/NationalParks";
import HomePage from "./components/HomePage/HomePage";
import StatePark from "./components/StateParks/StateParks";
function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/GoWild" element={<NationalForests />} />
            <Route path="/StateParks" element={<StatePark />} />
            <Route path="/NatParks" element={<NationalParks />} />
        </Routes>
    );
}
export default App;
