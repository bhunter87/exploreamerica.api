import React, { Component, useEffect, useState } from "react";
import "./MainPage.css";
const Cursor = () => {
    const [state, setState] = useState({
        left: 0,
        top: 0,
    });

    useEffect(() => {
        document.addEventListener("mousemove", (e) => {
            setState({ left: e.pageX, top: e.pageY });
        });
    }, []);

    return (
        <div
            style={{
                left: state.left,
                top: state.top,
                backgroundImage: "map.jpg",
                clipPath: `circle(10em at ${state.left}px ${state.top}px)`,
            }}
            className="cursor"
        ></div>
    );
};
export default Cursor;
