FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ../JadwalPetani.csproj ./
RUN dotnet restore

COPY ../. ./

RUN dotnet publish JadwalPetani.csproj -c Release -o /app/publish \
    --no-restore -p:DebugType=None -p:DebugSymbols=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV TZ=UTC

ENTRYPOINT ["dotnet", "JadwalPetani.dll"]
