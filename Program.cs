using ChooseYourAdventure.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "webapi", Version = "v1" });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Adds database connection - must be before app.Build();
builder.Services.AddDbContext<MyContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetRequiredService<IConfiguration>();

builder.Services.AddCors(opt => {
    opt.AddPolicy(name: "CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
});




// builder.Services.AddCors(options =>
// {
    
//     var frontendURL = configuration.GetValue<string>("frontend_url");

//     options.AddDefaultPolicy(builder =>
//     {
//         builder.WithOrigins(frontendURL).AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin().SetIsOriginAllowed(origin => true).SetIsOriginAllowedToAllowWildcardSubdomains().WithHeaders("Access-Control-Allow-Origin", "*");
        
        
//     });
// });




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("CorsPolicy");
app.MapControllers();

app.Run();
