# Explore America API
> Explore America API was built as a side project while I attended a coding bootcamp. After realizing the many security flaws with regards to access to Google Maps API, I decided to build an app around this project (Wilderness Finder) and leave the API for private use for now.



## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)
<!-- * [License](#license) -->


## General Information
- *What* - This API is an exhaustive collection of geodata for all state parks, national parks, national forests, and other federal and state attractions.
- *Why* - While the data was available, it was not easily accessible, and I felt an open and easy to use collection would be cool!
- *How* - Built using a series of web scrapers and crawlers, as well as Google Places API calls to gather data, and C# modeling and Entity Framwork to populate. 
<!-- You don't have to answer all the questions - just the ones relevant to your project. -->


## Technologies and Tools Used
- C# - ASP.NET, Entity Framework
- Javascript - Axios, Cherio, FS
- Postman


## Features

- Access to 5000+ geolocations, organized by state, organizational body, and location
- Includes globally accurate distance from a given point, formatted addresses, and radius search (by state, goecoord, and park type) 

## Screenshots
![Demo](explore.gif)(https://youtu.be/oSNjAMh5shY)

## Usage
I hope to host this API pubically in the near future! if you have genuine need of or interest in the data behind the database, please reach out as I have backups stored locally. 


## Project Status
Project is: _in progress_ 

As mentioned above, when I get a little deeper understanding of API keys and security, I would love to host the API publically. 

In addition, my goal is to build out the database with more outdoors and adventure data, like activities within each park, links to reserveamerica.com for camping, etc. 

## Room for Improvement
This was the first real thing I built in C#, so the needs for improvement are many! .

Room for improvement:
- The project's scope grew quickly and I didn't modularize the modeling, so first thing will be to reassess the code structure and move models into their own files for ease of accessability and readability
- COMMENTING! That's something I'm actively working on for all projects, and this one needs some love. 

To do:
- User login and registration - simple addition with longer-term plans to allow user ratings and 'share your adventure' to socials. 
- Add camping locations and at least links to reserveamerica.com, if not an actual connection to their database which I'm working on. 
- Park activities! I would love for users to be able to plan multi-stop, multi-day trips, based around certain activites in state or national parks. For example: mountain biking between San Diego and Oklahoma City


## Acknowledgements

- Alltrails.com! - I love that site and what they do!
- Many thanks to Max, my instructor at Coding Dojo, who daily endured my questions about things that neither of us had experience in! :)


<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->