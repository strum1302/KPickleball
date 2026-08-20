# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/KPickleball.API/KPickleball.API.csproj", "src/KPickleball.API/"]
COPY ["src/KPickleball.Application/KPickleball.Application.csproj", "src/KPickleball.Application/"]
COPY ["src/KPickleball.Domain/KPickleball.Domain.csproj", "src/KPickleball.Domain/"]
COPY ["src/KPickleball.Infrastructure/KPickleball.Infrastructure.csproj", "src/KPickleball.Infrastructure/"]

RUN dotnet restore "src/KPickleball.API/KPickleball.API.csproj"

COPY . .
WORKDIR "/src/src/KPickleball.API"
RUN dotnet build "KPickleball.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "KPickleball.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "KPickleball.API.dll"]