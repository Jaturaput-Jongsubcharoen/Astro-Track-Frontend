FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AstroTrack.Api/AstroTrack.Api.csproj AstroTrack.Api/
RUN dotnet restore AstroTrack.Api/AstroTrack.Api.csproj

COPY . .
RUN dotnet publish AstroTrack.Api/AstroTrack.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "AstroTrack.Api.dll"]
