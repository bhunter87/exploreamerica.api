FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /source
COPY . .
RUN dotnet restore "./exploreamerica.api.csproj" --disable-parallel
RUN dotnet publish "./exploreamerica.api.csproj" -c release -o /app --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal
WORKDIR /app
COPY --from=build /app ./


EXPOSE 5000

ENTRYPOINT [ "dotnet", "exploreamerica.api.dll" ]
