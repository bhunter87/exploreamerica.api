const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

function getter() {
    const wikipedia = "https://en.wikipedia.org";
    const natForestWikiPage =
        wikipedia + "/wiki/List_of_national_forests_of_the_United_States";
    axios.get(natForestWikiPage).then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab the #mw-content-text .wikitable tag, and do the following:
        const table = Array.from($(".wikitable"))[0];
        const rows = Array.from($(table).find("tr"));
        let parkNameCol = 0;
        let parkLocationCol = null; // country/parish/island...
        let parkImageCol = null;
        let parkRemarksCol = null;
        // console.log("table", table);
        // console.log("rows", rows);

        // first row is the header info, figure out the columns
        $(rows[0])
            .children()
            // .find("small")
            .each(function (i, element) {
                const colText = $(this).text().trim();

                // console.log("colText", colText);

                if (
                    (colText.includes("County") ||
                        colText.includes("Location") ||
                        colText.includes("Region") ||
                        colText.includes("Parish")) &&
                    !parkLocationCol
                ) {
                    parkLocationCol = i;
                }
            });

        let arrayOfNewNatParks = [];
        // now grab the actual rows of data
        for (let i = 1; i < rows.length; i++) {
            // skip 0/the header

            const columns = Array.from($(rows[i]).children());

            const parkName = clean($(columns[parkNameCol]).text());

            // sometimes there is a second row that holds acreage -not a park
            if (parkName.toLowerCase() != "acres") {
                let state = $(columns[parkLocationCol])
                    .text()
                    .substring(
                        0,
                        $(columns[parkLocationCol]).text().search(/[0-9]/)
                    );
                let thisLocation = $(columns[parkLocationCol])
                    .text()
                    .substring(
                        $(columns[parkLocationCol]).text().search(/[0-9]/),
                        $(columns[parkLocationCol]).text().length
                    )
                    .split("/");
                let temp = thisLocation[2].split("(");
                thisLocation = temp[0];

                arrayOfNewNatParks.push({
                    name: parkName,
                    location: clean(thisLocation),
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
        console.log(arrayOfNewNatParks);
        fs.writeFile(
            `NationalForests.json`,
            JSON.stringify(arrayOfNewNatParks),
            (err) => {
                if (err) throw err;
            }
        );
    });
}
getter();

// function getStatesParks(state, url) {
//     if (state == "Alaska" || state == "Hawaii") {
//         return "";
//         // getStateParksFromLists(state, url);
//     } else if (state == "Alabama")
//         return getStatesParksFromTable(state, url);
// }

function getStatesParksFromTable(url) {
    // First, we grab the body of the html with request
    // console.log("this is URL top of table func", url);

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
        // console.log("table", table);
        // console.log("rows", rows);

        // first row is the header info, figure out the columns
        $(rows[0])
            .children()
            .each(function (i, element) {
                const colText = $(this).text().trim();

                // console.log("colText", colText);

                // if (state == "Kentucky") {
                //     parkNameCol = 1;
                // } else if (
                //     (colText.includes("County") ||
                //         colText.includes("Location") ||
                //         colText.includes("Region") ||
                //         colText.includes("Parish")) &&
                //     !parkLocationCol
                // ) {
                //     parkLocationCol = i;
                // } else if (colText.includes("Image")) {
                //     parkImageCol = i;
                // } else if (
                //     colText.includes("Remarks") ||
                //     colText.includes("Description")
                // ) {
                //     parkRemarksCol = i;
                // }
            });

        let arrayOfNewNatParks = [];
        // now grab the actual rows of data
        for (let i = 1; i < rows.length; i++) {
            // skip 0/the header

            const columns = Array.from($(rows[i]).children());

            const parkName = clean($(columns[parkNameCol]).text());

            // sometimes there is a second row that holds acreage -not a park
            if (parkName.toLowerCase() != "acres") {
                arrayOfNewNatParks.push({
                    name: parkName,
                    location: clean($(columns[parkLocationCol]).text()),

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
        console.log(arrayOfNewNatParks);

        // db.StatePark.insertMany(arrayOfNewNatParks);
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
    console.log(state);
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
                        name != "Lists of state parks of the United States" &&
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
        // db.StatePark.insertMany(arrayOfNewStateParks);
        console.log(arrayOfNewStateParks);
    });
}

// app.get("/admin/count", function (req, res) {
//     db.StatePark.count({}, function (err, c) {
//         console.log("Count is " + c);
//         res.send(`Total: ${c}`);
//     });
// });

// app.get("/admin/populateLocation", function (req, res) {
//     // db.inventory.find( { item: null } )
//     db.StatePark.find({ address: null }).then(function (results) {
//         recursivelyGeocodeArrayElements(results);

// res.send(
//     "Populating Address from Google... " +
//         results.length +
//         " to do..."
// );
//     });
// });

// now I want not just the lat/lng, but the much nicer address to be stored
function recursivelyGeocodeArrayElements(array) {
    console.log(
        "recursivelyGeocodeArrayElements... " + array.length + " to do..."
    );
    if (array.length < 1) return; // done!

    const park = array.pop();

    console.log(
        "Geocode an address: " + `${park.name}, ${park.state}, ${park.country}`
    );
    googleMapsClient.geocode(
        {
            address: `${park.name}, ${park.state}, ${park.country}`,
        },
        function (err, response) {
            if (!err) {
                //console.log(response);
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

// -----------------------------------------------------

// app.get("/admin/downloadBackup", function (req, res) {
//     //console.log(id);
//     db.StatePark.find({})
//         .then(function (results) {
//             // If all Users are successfully found, send them back to the client
//             res.json(results);
//         })
//         .catch(function (err) {
//             // If an error occurs, send the error back to the client
//             res.json(err);
//         });
// });

// app.get("/admin/restoreBackup", function (req, res) {
//     dropAllTheData();

//     let backupJSON = require("../../../models/backup.json");
//     //console.log(backupJSON);
//     db.StatePark.insertMany(backupJSON)
//         .then(function (results) {
//             res.send("Backup restored.");
//         })
//         .catch(function (err) {
//             // If an error occurs, send the error back to the client
//             res.json(err);
//         });
// });

// app.get("/admin/populateNationalParks", function (req, res) {
//     const states = Object.keys(tableByAbbr);
//     states.push("DC");
//     let url =
//         "https://api.nps.gov/api/v1/parks?limit=100&fields=images%2ClatLong%2Caddresses&api_key=7iaGGOvQmuUQWwppC6tU5RfYsBWzcWWeakpcZcqo";

//     states.forEach((s) => {
//         axios
//             .get(`${url}&stateCode=${s}`)
//             .then((response) => {
//                 let stateFullName = "District of Columbia";
//                 if (s != "DC") {
//                     stateFullName = tableByAbbr[s.toUpperCase()];
//                 }
//                 //console.log(response.data);
//                 console.log(stateFullName + ":" + response.data.total);

//                 const parksToInsert = response.data.data.map((p) => {
//                     let lat = null;
//                     let lng = null;
//                     if (p.latLong) {
//                         const latLong = p.latLong.split(",");
//                         lat = parseFloat(
//                             latLong[0].replace("lat:", "").trim()
//                         );
//                         lng = parseFloat(
//                             latLong[1].replace("long:", "").trim()
//                         );
//                     }
//                     let address = null;
//                     if (p.addresses && p.images.length > 0) {
//                         //console.log(p);
//                         const a = p.addresses[0];
//                         address = `${a.line1} ${a.line2}, ${a.city}, ${a.stateCode}, ${a.postalCode}`;
//                     }

//                     // return new db.StatePark
//                     console.log({
//                         name: p.fullName,
//                         location: p.directionsInfo + " " + p.directionsUrl,
//                         longitudeLatitude: lat && lng ? [lng, lat] : null,
//                         address: address,
//                         state: stateFullName,
//                         country: "USA",
//                         imageURL:
//                             p.images.length > 0 ? p.images[0].url : null,
//                         remarks: p.description + " " + p.url,
//                     });
//                 });

//                 db.StatePark.insertMany(parksToInsert);
//                 //console.log(parksToInsert);
//                 console.log(
//                     stateFullName +
//                         ":" +
//                         parksToInsert.length +
//                         " attempted to insert"
//                 );
//             })
//             .catch(function (err) {
//                 console.log(url);
//                 console.log(err);
//             });
//     });
//     // res.send("Populating...");
// });
