import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import "./MainPage.css";

function HomePage() {
    const parkButtonString = `Stay Local ${"\n"}`;

    return (
        <>
            <img class="bg" src="mountains.png" alt="" />

            <Flex>
                <Box zIndex={3} className="main">
                    <div className="mainTitle">
                        Exploration is in Our Nature.
                    </div>
                    <div className="mainSubTitle">
                        The only thing standing between you and your next
                        adventure is the click of a button.
                    </div>
                    <div className="buttonHouse">
                        <Link
                            to="/StateParks"
                            className="button1 bouncy btn btn-outline-dark row"
                        >
                            <svg viewBox="0 0 86 20">
                                <text x="15" y="17">
                                    Stay Local
                                </text>
                            </svg>
                            <svg viewBox="0 0 220 30">
                                <text x="60" y="15">
                                    Find a State Park
                                </text>
                            </svg>
                        </Link>
                        <Link
                            to="/NatParks"
                            className="button1 bouncy btn btn-outline-dark row"
                        >
                            <svg viewBox="0 0 86 20">
                                <text x="17" y="17">
                                    Think Big
                                </text>
                            </svg>
                            <svg viewBox="0 0 220 30">
                                <text x="52" y="15">
                                    Find a National Park
                                </text>
                            </svg>
                        </Link>
                        <Link
                            to="/GoWild"
                            className="button1 bouncy btn btn-outline-dark row"
                        >
                            <svg viewBox="0 0 86 20">
                                <text x="23" y="17">
                                    Go Wild
                                </text>
                            </svg>
                            <svg viewBox="0 0 220 30">
                                <text x="52" y="15">
                                    Find a National Forest
                                </text>
                            </svg>
                        </Link>
                    </div>
                </Box>
            </Flex>
        </>
    );
}
export default HomePage;
