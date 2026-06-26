using KPickleball.Application.DTOs;
using KPickleball.Application.Interfaces;

namespace KPickleball.Application.Services;

public class CourtService : ICourtService
{
    private readonly ICourtRepository _courtRepo;

    public CourtService(ICourtRepository courtRepo) => _courtRepo = courtRepo;

    // Entity를 가져와서 -> CourtListDto(record)로 변환
    public async Task<IEnumerable<CourtListDto>> GetAllCourtsAsync(string? state)
    {
        // 1. Repository에서는 Entity를 받아옴
        var courts = await _courtRepo.GetAllAsync();

        if (!string.IsNullOrWhiteSpace(state))
            courts = courts.Where(c => c.State.Equals(state, StringComparison.OrdinalIgnoreCase)).ToList();

        // 2. Service에서 DTO로 가공하여 반환
        return courts.Select(c => new CourtListDto(
            c.Id, c.Name, c.Address, c.State, c.City, c.Latitude, c.Longitude, 
            c.NumberOfCourts, c.IsIndoor, c.IsFree,
            c.Reviews?.Count ?? 0,
            c.Reviews?.Any() == true ? Math.Round(c.Reviews.Average(r => r.Rating), 1) : 0.0
        ));
    }

    // Entity를 가져와서 -> CourtDetailDto(record)로 변환
    public async Task<CourtDetailDto?> GetCourtByIdAsync(int id)
    {
        var court = await _courtRepo.GetByIdAsync(id);
        if (court == null) return null;

        var reviews = court.Reviews?.Select(r => new CourtReviewDto(r.Rating, r.Comment, r.UserId)).ToList() 
                      ?? new List<CourtReviewDto>();

        return new CourtDetailDto(
            court.Id, court.Name, court.Address, court.State, court.City, court.Latitude, court.Longitude, 
            court.NumberOfCourts, court.IsIndoor, court.IsFree, court.Notes,
            court.Reviews?.Count ?? 0,
            court.Reviews?.Any() == true ? Math.Round(court.Reviews.Average(r => r.Rating), 1) : 0.0,
            reviews
        );
    }
}