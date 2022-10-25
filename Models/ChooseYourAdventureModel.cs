#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ChooseYourAdventure.Models;


public class Location
{
    [Key]
    public int LocationId {get;set;}
    public double lat {get;set;}
    public double lng {get;set;}

    

    public double CalculateDistanceFromThisLocation(Location point2)
    {
        var d1 = this.lat * (Math.PI / 180.0);
        var num1 = this.lng * (Math.PI / 180.0);
        var d2 = point2.lat * (Math.PI / 180.0);
        var num2 = point2.lng * (Math.PI / 180.0) - num1;
        var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) +
                 Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);
        var tempResult = 6376500.0 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)));
        return MetersToMiles((int)tempResult);
    }

    public double CalculateDistanceFromThisCoord(double point1lat, double point1lng,double point2lat, double point2lng)
    {
        var d1 = point1lat * (Math.PI / 180.0);
        var num1 = point1lng * (Math.PI / 180.0);
        var d2 = point2lat * (Math.PI / 180.0);
        var num2 = point2lng * (Math.PI / 180.0) - num1;
        var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) +
                 Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);
        var tempResult = 6376500.0 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)));
        return MetersToMiles((int)tempResult);
    }

    public double factor = 0.621371;
    public double MilesToKm(double miles)
    {
        return miles/factor;
    }
    public double KmToMiles(double miles)
    {
        return miles * factor;
    }
    public double MilesToMeters(double miles)
    {
        return miles * 1609.344;
    }
    public double MetersToMiles(double meters)
    {
        return KmToMiles(meters * .001);
    }

}


public class NationalForest
{
    [Key]
    public int NationalForestId {get;set;}
    public string ForestName {get;set;}
    public int LocationId {get;set;}
    public Location location {get;set;}

    [NotMapped]
    public string[] state {get;set;} 
    [NotMapped]
    public int Distance {get;set;}

}


public class ForestState
{
    [Key]
    public int ForestStateId {get;set;}

    [ForeignKey("NationalForestId")]
    public int NationalForestId{get;set;}
    public NationalForest NationalForest{get;set;}


    [ForeignKey("StateId")]
    public int StateId{get;set;}
    public State State{get;set;}


}

public class StatePark
{
    [Key]
    public int StateParkId {get;set;}
    public string formatted_address {get;set;}
    public string name {get;set;}
    public int LocationId {get;set;}
    public Location location {get;set;} = new Location();
    public int StateId {get;set;}
    public State State {get;set;}

    [NotMapped]
    public int Distance {get;set;}
}
public class State
{
    [Key]
    public int StateId {get;set;}
    public string StateName {get;set;}

    public List<ForestState> NationalForestsInThisState {get;set;} = new List<ForestState>();

}

public class NationalPark
    {
        [Key]
        public int NationalParkId {get;set;}
        public string id { get; set; }
        public string url { get; set; }
        public string fullName { get; set; }
        public string parkCode { get; set; }
        public string description { get; set; }
        // public double latitude { get; set; }
        // public double longitude { get; set; }
        public int LocationId{get;set;}
        public Location location { get; set; } = new Location();
        public List<ParkActivities> activities { get; set; }
        public string directionsUrl { get; set; }
        public string name { get; set; }
        public string designation { get; set; }
        public string formal_address { get; set; }


        [NotMapped]
        public string[] states {get;set;}
        [NotMapped]
    public int Distance {get;set;}

    }

    public class ParkActivities
    {
        [Key]
        public int ParkActivityId{get;set;}
        [ForeignKey("ActivityId")]
        public int ActivityId{get;set;}
        [ForeignKey("NationalParkId")]
        public int NationalParkId{get;set;}
    }

    public class Activity
    {
        [Key]
        public int ActivityId{get;set;}
        public string id { get; set; }
        public string name { get; set; }
    }

    public class ParkState
    {
        [Key]
        public int ParkStateId{get;set;}

        [ForeignKey("StateId")]
        public int StateId{get;set;}
        public State State{get;set;}
        [ForeignKey("NationalParkId")]
        public int NationalParkId{get;set;}
        public NationalPark NationalPark {get;set;}
    }