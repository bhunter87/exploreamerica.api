import { Box, Flex } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
    // document.body.style.backgroundImage = `url(${require("../HomePage/mountains.png")})`;
    // document.body.style.backgroundSize = "cover";

    return (
        <>
            <img class="bg" src="mountains.png" alt="" />

            <Flex
                position="relative"
                flexDirection="column"
                alignItems="center"
                margin="auto"
            >
                <Box fontSize="5em" marginTop="20%">
                    PREPARING YOUR ADVENTURE...
                </Box>
            </Flex>
        </>
    );
};
export default Loading;
