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
public class NationalForestController : ControllerBase
{
    private MyContext _context;
    public NationalForestController(MyContext context)
    {
        _context = context;
    }


    [HttpGet]
    public List<NationalForest> GetNationalForests(int count = 5, double lat = 0, double lng = 0, int radiusInMiles = 1000)
    {
        List<NationalForest> NationalForestList = _context.NationalForest.Include(e=>e.location).ToList();
        if(lat != 0 || lng != 0)
        {
            // Assigning Distance to each park from current local
            
            foreach (NationalForest park in NationalForestList)
            {
                var thisDistance = park.location.CalculateDistanceFromThisCoord(lat, lng, park.location.lat, park.location.lng);
                park.Distance = (int)thisDistance;
            }
            // Order the list asscending by distance
            List<NationalForest> ordered = NationalForestList.OrderBy(e=> e.Distance).ToList();
            // new list to populate based on the Count param
            List<NationalForest> returnListCoords = new List<NationalForest>();
            foreach (int item in Enumerable.Range(0,count-1))
            {
                if(ordered[item].Distance <= radiusInMiles)
                {
                returnListCoords.Add(ordered[item]);
                }
            }
            return returnListCoords;
        }
        else
        {
        List<NationalForest> single = new List<NationalForest>();
        for (int i = 0; i < count; i++)
        {
            single.Add(NationalForestList[i]);
        }
        return single;
        }
    }


    [HttpGet("{statename}")]
    public List<NationalForest> GetNatParkByState(string statename)
    {
            State thisState = _context.States.FirstOrDefault(e=> e.StateName == statename);

            List<NationalForest> NationalForestList = _context.NationalForest.Include(e=>e.location).ToList();

            List<ForestState> forestStates = _context.ForestStates.ToList();

            List<NationalForest> statesParks = new List<NationalForest>();
        

            foreach (ForestState thisForestState in forestStates)
        {
            
            if(thisForestState.StateId == thisState.StateId)
            {
                Console.WriteLine(thisForestState.StateId);
                Console.WriteLine(thisState.StateId);
                
                statesParks.Add(NationalForestList.FirstOrDefault(e=> e.NationalForestId == thisForestState.NationalForestId));
            }
        }
        return statesParks;
        
    }
}
    
    



