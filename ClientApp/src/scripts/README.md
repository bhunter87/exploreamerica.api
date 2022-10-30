# Project Title

A simple crawler/scraper setup to grab all the state park names from wikipedia, then compiles, restuructures, and runs through google places API

## Getting Started

To run, aside from having the dependencies installed (cherrio, fs, and axios), you should be able to run this as a stand alone js file

### Prerequisites

Requirements for the software and other tools to build, test and push

-   internet
-   some desire to have the goelocations of all state parks
-   a Google Could API key that has access to the "Places" API

### Installing

After getting the file and dependencies together, you'll want to run the populate json files first. - this will run through all the state park pages on wikipedia and build json docs with the data

once you have the base docs on your machine, run the data through openAndReadStateParkJson() - this will use the locally stored files to make calls to Google Places API

## Running the tests

Start small in testing. There's not a whole lot you can mess up in testing unless you put the Google Places API call in a while loop, in which case I feel sorry for your bank account. Otherwise, copy, paste, initalize the first function, and you're off to the races

## Built With

-   Vanilla Javascript
-   Blood, Sweat, and Tears

## Contributing

Part of the code was rebuilt from an old repository I found here: https://github.com/aarontkennedy/usaStateParks

## Authors

-   **Blake Hunter**
-   **Billie Thompson** - _Provided README Template_ -

## License

No license - use freely in whatever way you want

## Acknowledgments

-   I don't plan to update or keep this thing working, however feel free to reach out if you have any questions!
