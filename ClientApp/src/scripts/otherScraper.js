const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// const MAP_API_KEY = KEY GOES HERE;
const API_LOADER_DATA = {
    libraries: ["places"],
    googleMapsApiKey: MAP_API_KEY,
};

// there's a way to iterate through a directory but I can't be bothered googleing it so here
const Alabama = require("./STATES/Alabama.json");
const Alaska = require("./STATES/Alaska.json");
const Arizona = require("./STATES/Arizona.json");
const Arkansas = require("./STATES/Arkansas.json");
const California = require("./STATES/California.json");
const Colorado = require("./STATES/Colorado.json");
const Connecticut = require("./STATES/Connecticut.json");
const Delaware = require("./STATES/Delaware.json");
const Florida = require("./STATES/Florida.json");
const Georgia = require("./STATES/Georgia.json");
const Hawaii = require("./STATES/Hawaii.json");
const Idaho = require("./STATES/Idaho.json");
const Illinois = require("./STATES/Illinois.json");
const Indiana = require("./STATES/Indiana.json");
const Iowa = require("./STATES/Iowa.json");
const Kansas = require("./STATES/Kansas.json");
const Kentucky = require("./STATES/Kentucky.json");
const Louisiana = require("./STATES/Louisiana.json");
const Maine = require("./STATES/Maine.json");
const Maryland = require("./STATES/Maryland.json");
const Massachusetts = require("./STATES/Massachusetts.json");
const Michigan = require("./STATES/Michigan.json");
const Minnesota = require("./STATES/Minnesota.json");
const Mississippi = require("./STATES/Mississippi.json");
const Missouri = require("./STATES/Missouri.json");
const Montana = require("./STATES/Montana.json");
const Nebraska = require("./STATES/Nebraska.json");
const Nevada = require("./STATES/Nevada.json");
const NewHampshire = require("./STATES/New Hampshire.json");
const NewJersey = require("./STATES/New Jersey.json");
const NewMexico = require("./STATES/New Mexico.json");
const NewYork = require("./STATES/New York.json");
const NorthCarolina = require("./STATES/North Carolina.json");
const NorthDakota = require("./STATES/North Dakota.json");
const Ohio = require("./STATES/Ohio.json");
const Oklahoma = require("./STATES/Oklahoma.json");
const Oregon = require("./STATES/Oregon.json");
const Pennsylvania = require("./STATES/Pennsylvania.json");
const RhodeIsland = require("./STATES/Rhode Island.json");
const SouthCarolina = require("./STATES/South Carolina.json");
const SouthDakota = require("./STATES/South Dakota.json");
const Tennessee = require("./STATES/Tennessee.json");
const Texas = require("./STATES/Texas.json");
const Utah = require("./STATES/Utah.json");
const Vermont = require("./STATES/Vermont.json");
const Virginia = require("./STATES/Virginia.json");
const Washington = require("./STATES/Washington.json");
const WestVirginia = require("./STATES/West Virginia.json");
const Wisconsin = require("./STATES/Wisconsin.json");
const Wyoming = require("./STATES/Wyoming.json");

// array of all the state vars from above - again could be simplified by iterating a directory
const states = [
    // states go here
];

const fetchStateParkDataFromGoogle = async (obj) => {
    // this didn't work perfectly and I had to modify for a couple states, but this works for the bulk.
    // cleaning up location and name data from the wiki to make readable by google places
    if (!obj.location) {
        location = "Alaska";
    } else if (obj.location.search(",")) {
        location = obj.location.slice(0, obj.location.search(","))[0];
    } else if (obj.location.search(" and")) {
        location = obj.location.slice(0, obj.location.search(" and "))[0];
    } else if (obj.location.search(".")) {
        location = obj.location.slice(0, obj.location.search("."))[0];
    } else if (obj.location.search(/^\d+$/)) {
        location = obj.location.slice(0, obj.location.search(/^\d+$/))[0];
    } else {
        location = obj.location;
    }

    if (obj.name.search(",")) {
        obj.name = obj.name.slice(0, obj.name.search(",") + 1);
    } else if (obj.name.search(" and ")) {
        obj.name = obj.name.slice(0, obj.name.search(" and") + 1);
    }
    let query = obj.name + "%20" + location + "%20" + obj.state;

    var config = {
        method: "get",
        url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${MAP_API_KEY}`,
        headers: {},
    };

    const parkData = await axios(config)
        .then(function (response) {
            let data = response.data;
            return data.candidates[0];
        })
        .catch(function (error) {
            console.log(error);
        });
    return parkData;
};

// opens each file, iterates through the object arrya, and runs each item through fetchStateParkDataFromGoogle
const openAndReadStateParkJson = async (state) => {
    // all this is mostly structuring so JSON is correct. my timings wasn't perfect here and there were ~3/5 per document that I hand corrected. So you won't have to reproduce, the 3 errors were
    // 1. I hoped it would cap the end of the doc with } however I did that manually - bad code
    // 2. a comma goes off early and ends up between the park name and it's data insteead of after
    // e.g. expected: That_One_Stae_Park: {name:--, geometry: --, etc.:...},{other park}
    // e.g. actual:, That_One_Stae_Park: {name:--, geometry: --, etc.:...}{other park}
    // only happens a couple times per doc, but only on some. wasn't big enough hassle to debug
    // 3. at a similar timing to the above, the park key gets misplaced to AFTER the park data
    // e.g. expected: That_One_Stae_Park: {name:--, geometry: --, etc.:...},{other park: ...data}
    // e.g. actual:  {name:--, geometry: --, etc.:...},{That_One_Stae_Park:other park: ...data}
    // rare but did happen.
    fs.writeFile(`${state[0].state}Final.json`, "{", (e) => e);
    for (let i = 0; i < state.length; i++) {
        await fetchStateParkDataFromGoogle(state[i])
            .then((d) => {
                console.log(state[i].name);
                fs.appendFile(
                    `${state[0].state}Final.json`,
                    JSON.stringify(state[i].name) + ":",
                    (e) => e
                );
                fs.appendFile(
                    `${state[0].state}Final.json`,
                    JSON.stringify(d),
                    (err) => {
                        if (err) throw err;
                    }
                );
            })

            .then((e) => {
                if (i === state.length) {
                    fs.appendFile(`${state[0].state}Final.json`, "}", (e) => e);
                } else {
                    fs.appendFile(`${state[0].state}Final.json`, ",", (e) => e);
                }
            });
    }
};

// intializes the above functions. Only run after the below has compiled all the data into json
const Catalyst = async () => {
    for (let state of states) {
        await openAndReadStateParkJson(state);
    }
};

// WIKI SCRAPER FOR ALL STATE PARK NAMES
// below is an old, broken wiki scraper from github (https://github.com/aarontkennedy/usaStateParks) that I changed up to work for my needs
function populateLocalJsonFiles() {
    const wikipedia = "https://en.wikipedia.org";
    const wikiStateParksIndexPage =
        wikipedia + "/wiki/Lists_of_state_parks_by_U.S._state";
    axios.get(wikiStateParksIndexPage).then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab the #mw-content-text ul tag, and do the following:
        const element = $("#mw-content-text ul")[0];

        $(element)
            .find("a")
            .each(function () {
                getStatesParks(
                    clean($(this).text()),
                    wikipedia + $(this).attr("href")
                );
            });
    });

    function getStatesParks(state, url) {
        if (state == "Alaska" || state == "Hawaii") {
            return getStateParksFromLists(state, url);
        } else {
            return getStatesParksFromTable(state, url);
        }
    }
    function getStatesParksFromTable(state, url) {
        console.log(url);

        // First, we grab the body of the html with request
        axios.get(url).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab the #mw-content-text .wikitable tag, and do the following:
            const table = Array.from($(".wikitable"))[0];
            const rows = Array.from($(table).find("tr"));
            let parkNameCol = 0;
            let parkLocationCol = null; // country/parish/island...
            let parkImageCol = null;
            let parkRemarksCol = null;

            // first row is the header info, figure out the columns
            $(rows[0])
                .children()
                .each(function (i, element) {
                    const colText = $(this).text().trim();

                    if (state == "Kentucky") {
                        parkNameCol = 1;
                    } else if (
                        (colText.includes("County") ||
                            colText.includes("Location") ||
                            colText.includes("Region") ||
                            colText.includes("Parish")) &&
                        !parkLocationCol
                    ) {
                        parkLocationCol = i;
                    } else if (colText.includes("Image")) {
                        parkImageCol = i;
                    } else if (
                        colText.includes("Remarks") ||
                        colText.includes("Description")
                    ) {
                        parkRemarksCol = i;
                    }
                });

            let arrayOfNewStateParks = [];
            // now grab the actual rows of data
            for (let i = 1; i < rows.length; i++) {
                // skip 0/the header

                const columns = Array.from($(rows[i]).children());

                const parkName = clean($(columns[parkNameCol]).text());

                // sometimes there is a second row that holds acreage -not a park
                if (parkName.toLowerCase() != "acres") {
                    arrayOfNewStateParks.push({
                        name: parkName,
                        location: clean($(columns[parkLocationCol]).text()),
                        state: state,
                        country: "USA",
                        imageURL: parkImageCol
                            ? cleanURL($(columns[parkImageCol]).text())
                            : null,
                        remarks: parkRemarksCol
                            ? clean($(columns[parkRemarksCol]).text())
                            : null,
                    });
                }
            }

            fs.writeFile(
                `${state}.json`,
                JSON.stringify(arrayOfNewStateParks),
                (err) => {
                    if (err) throw err;
                }
            );
        });
    }

    function clean(string) {
        // ran into a problem with unicode space 160...
        return string
            .trim()
            .replace(/\[.*\]/g, "")
            .replace(/\s/g /* all kinds of spaces*/, " " /* ordinary space */);
    }

    function cleanURL(string) {
        const url = clean(string);
        const patt = new RegExp(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        );
        if (patt.test(url)) return url;
        return null;
    }

    function getStateParksFromLists(state, url) {
        // First, we grab the body of the html with request
        axios.get(url).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            let arrayOfNewStateParks = [];

            $("ul").each(function (i, element) {
                $(this)
                    .children()
                    .each(function (i, element) {
                        const name = clean($(this).text());

                        if (
                            (name.includes("State") || name.includes("Park")) &&
                            !name.includes("\n") &&
                            name != "State symbols" &&
                            name != "State parks of Hawaii" &&
                            name !=
                                "Lists of state parks of the United States" &&
                            name != "State parks of Alaska" &&
                            !name.startsWith(
                                "Alaska Department of Natural Resources"
                            )
                        ) {
                            arrayOfNewStateParks.push({
                                name: name,
                                state: state,
                                country: "USA",
                            });
                        }
                    });
            });

            fs.writeFile(
                `${state}.json`,
                JSON.stringify(arrayOfNewStateParks),
                (err) => {
                    if (err) throw err;
                }
            );
        });
    }

    // BLAKE NOTES: I didn't do this - google places has formatted addresses anyways
    // now I want not just the lat/lng, but the much nicer address to be stored
    function recursivelyGeocodeArrayElements(array) {
        console.log(
            "recursivelyGeocodeArrayElements... " + array.length + " to do..."
        );
        if (array.length < 1) return; // done!

        const park = array.pop();

        console.log(
            "Geocode an address: " +
                `${park.name}, ${park.state}, ${park.country}`
        );
        googleMapsClient.geocode(
            {
                address: `${park.name}, ${park.state}, ${park.country}`,
            },
            function (err, response) {
                if (!err) {
                    console.log(response.json.results[0]);
                    console.log(response.json.results[0].formatted_address);
                    console.log(response.json.results[0].geometry.location);
                    db.StatePark.updateOne(
                        { _id: park._id },
                        {
                            address: response.json.results[0].formatted_address,
                            longitudeLatitude: [
                                response.json.results[0].geometry.location.lng,
                                response.json.results[0].geometry.location.lat,
                            ],
                        }
                    ).exec();

                    setTimeout(() => {
                        recursivelyGeocodeArrayElements(array);
                    }, 200);
                } else {
                    console.log(Object.keys(err));
                    console.log(err.status);
                    console.log(err.headers);
                    console.log(err.json);
                    console.log("Geocode Error: " + err + ". Giving up...");
                }
            }
        );
    }
}
