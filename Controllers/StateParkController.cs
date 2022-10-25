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
public class StateParkController : ControllerBase
{
    private MyContext _context;
    public StateParkController(MyContext context)
    {
        _context = context;
    }


    [HttpGet]
    public List<StatePark> GetStateParks(int count = 5, double lat = 0, double lng = 0, int radiusInMiles = 10000)
    {
        List<StatePark> StateParkList = _context.StateParks.Include(e=>e.location).Include(e=>e.State).ToList();
        if(lat != 0 && lng != 0)
        {
        
            // Assigning Distance to each park from current local
            foreach (StatePark park in StateParkList)
            {
                var thisDistance = park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
                park.Distance = (int)thisDistance;

            }
            // Order the list asscending by distance
            List<StatePark> ordered = StateParkList.OrderBy(e=> e.Distance).ToList();
            // new list to populate based on the Count param
            List<StatePark> returnListCoords = new List<StatePark>();
            Console.WriteLine(ordered.Count());
            Console.WriteLine(ordered);

            
            foreach (int item in Enumerable.Range(1,count))
            {
                returnListCoords.Add(ordered[item]);
            }
            
            return returnListCoords;
        }
        List<StatePark> returnList = new List<StatePark>();
            for (int i = 0; i < count; i++)
            {
                returnList.Add(StateParkList[i]);
            }
            return returnList;
    }

    [HttpGet("{statename}")]
    public List<StatePark> GetParkByState(string statename, int count = 5, double lat = 0, double lng = 0, int radiusInMiles = 10000)
    {
        if(lat != 0 && lng != 0)
        {
            List<StatePark> StateParkList = _context.StateParks.Include(e=>e.location).Include(e=>e.State).Where(e => e.State.StateName == statename).ToList();
        
            List<StatePark> ClosestParks = new List<StatePark>();
            foreach (StatePark park in StateParkList)
            {
                var thisDistance = park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
                if(thisDistance < radiusInMiles && ClosestParks.Count() <= count-1)
                {
                    park.Distance = (int)thisDistance;
                    ClosestParks.Add(park);
                }else if(thisDistance < radiusInMiles && ClosestParks.Count() >= count)
                {
                    foreach (StatePark closePark in ClosestParks)
                    {
                        if(closePark.Distance > thisDistance)
                        {
                            ClosestParks.Remove(closePark);
                            ClosestParks.Add(park);
                        }
                    }
                }

            }
        return ClosestParks.OrderBy(e=> e.Distance).ToList();
        }
        else
        {
        List<StatePark> thisStatesParks = _context.StateParks.Include(e=>e.location).Include(e=>e.State).Where(e=>e.State.StateName == statename).ToList();
        return thisStatesParks;
        }
    }




}
    // [HttpGet("park")]
    // public StatePark GetClosestStatePark(double lat, double lng)
    // {
    //     List<StatePark> StateParkList = _context.StateParks.Include(e=>e.location).ToList();
    //     int distance = int.MaxValue;
    //     StatePark ClosestPark = null;
    //     foreach (StatePark park in StateParkList)
    //     {
    //         if(ClosestPark == null)
    //         {
    //             ClosestPark = park;
    //         }
    //         if(park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng) < distance)
    //         {
    //             distance = (int)park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
    //             ClosestPark = park;
    //         }
    //     }
    //     return ClosestPark;
    // }

    // [HttpGet("parks")]
    // public List<StatePark> GetStateParksInRadius(double lat, double lng, int radiusInMiles = 100, int count = 5)
    // {
    //     List<StatePark> StateParkList = _context.StateParks.Include(e=>e.location).ToList();
        
    //     List<StatePark> ClosestParks = new List<StatePark>();
    //     foreach (StatePark park in StateParkList)
    //     {
            
    //         if(park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng) < radiusInMiles && ClosestParks.Count() <= count-1)
    //         {
    //             park.Distance = (int)park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
    //             ClosestParks.Add(park);
    //         }

    //     }
    //     return ClosestParks.OrderBy(e=> e.Distance).ToList();
    // }
