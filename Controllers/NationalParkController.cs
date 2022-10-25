using System.Data;
using ChooseYourAdventure.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;


namespace ChooseYourAdventure.Controllers;
[ApiController]

[Route("/api/v1.0/[controller]/")]
// 
public class NationalParkController : ControllerBase
{
    private MyContext _context;
    public NationalParkController(MyContext context)
    {
        _context = context;
    }


    [HttpGet]
    public List<NationalPark> GetNationalParks(int count = 5, double lat = 0, double lng = 0, int radiusInMiles = 10000)
    {
        List<NationalPark> NationalParkList = _context.NationalParks.Include(e=>e.location).ToList();
        if(lat != 0 && lng != 0)
        {
            // Assigning Distance to each park from current local
            foreach (NationalPark park in NationalParkList)
            {
                var thisDistance = park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
                park.Distance = (int)thisDistance;

            }
            // Order the list asscending by distance
            List<NationalPark> ordered = NationalParkList.OrderBy(e=> e.Distance).ToList();
            // new list to populate based on the Count param
            List<NationalPark> returnListCoords = new List<NationalPark>();
            Console.WriteLine(ordered.Count());
            Console.WriteLine(ordered);

            
            foreach (int item in Enumerable.Range(1,count))
            {
                returnListCoords.Add(ordered[item]);
            }
            
            return returnListCoords;
        }
        List<NationalPark> returnList = new List<NationalPark>();
            for (int i = 0; i < count; i++)
            {
                returnList.Add(NationalParkList[i]);
            }
            return returnList;
    }


    [HttpGet("{statename}")]

    public List<NationalPark> GetParkByState(string statename)
    {

        State thisState = _context.States.FirstOrDefault(e=> e.StateName == statename);

        List<NationalPark> NationalParkList = _context.NationalParks.Include(e=>e.location).ToList();

        List<ParkState> parkStates = _context.ParkStates.ToList();

        List<NationalPark> statesParks = new List<NationalPark>();


        foreach (ParkState parkState in parkStates)
        {
            if(parkState.StateId == thisState.StateId)
            {
                statesParks.Add(NationalParkList.FirstOrDefault(e=> e.NationalParkId == parkState.NationalParkId));
            }
        }
        return statesParks;
        }
    
}