FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyRixi-API/MyRixi-API.csproj", "MyRixi-API/"]
RUN dotnet restore "MyRixi-API/MyRixi-API.csproj"
COPY . .
WORKDIR "/src/MyRixi-API"
RUN dotnet build "MyRixi-API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyRixi-API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyRixi-API.dll"]