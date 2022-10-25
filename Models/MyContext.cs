#pragma warning disable CS8618
/* 
Disabled Warning: "Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable."
We can disable this safely because we know the framework will assign non-null values when it constructs this class for us.
*/
using Microsoft.EntityFrameworkCore;
namespace ChooseYourAdventure.Models;
// the MyContext class representing a session with our MySQL database, allowing us to query for or save data
public class MyContext : DbContext 
{ 
    public MyContext(DbContextOptions options) : base(options) { }

    public DbSet<StatePark> StateParks { get; set; } 
    public DbSet<NationalForest> NationalForest { get; set; } 
    public DbSet<State> States { get; set; } 
    public DbSet<Location> Locations { get; set; } 
    public DbSet<ForestState> ForestStates { get; set; } 
    public DbSet<NationalPark> NationalParks { get; set; } 
    public DbSet<Activity> Activities { get; set; } 
    public DbSet<ParkState> ParkStates { get; set; } 
}
