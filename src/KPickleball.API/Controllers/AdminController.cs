
using KPickleball.Application.Interfaces;
using KPickleball.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepo;

    public AdminController(IUserRepository userRepo)
        => _userRepo = userRepo;

    // 가입 대기 회원 목록
    [HttpGet("pending-members")]
    public async Task<IActionResult> GetPendingMembers()
    {
        var users = await _userRepo.FindAsync(
            u => u.MemberStatus == MemberStatus.Pending);

        var result = users.Select(u => new
        {
            u.Id, u.Email, u.Nickname,
            u.State, u.City, u.CreatedAt
        });
        return Ok(result);
    }

    // 회원 승인
    [HttpPut("approve/{userId}")]
    public async Task<IActionResult> ApproveMember(int userId)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("회원을 찾을 수 없습니다.");

        user.MemberStatus = MemberStatus.Approved;
        await _userRepo.SaveChangesAsync();
        return Ok(new { message = $"{user.Nickname} 님이 승인되었습니다." });
    }

    // 회원 거절
    [HttpPut("reject/{userId}")]
    public async Task<IActionResult> RejectMember(int userId)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("회원을 찾을 수 없습니다.");

        user.MemberStatus = MemberStatus.Rejected;
        await _userRepo.SaveChangesAsync();
        return Ok(new { message = $"{user.Nickname} 님이 거절되었습니다." });
    }

    // 전체 회원 목록
    [HttpGet("members")]
    public async Task<IActionResult> GetAllMembers()
    {
        var users = await _userRepo.GetAllAsync();
        var result = users.Select(u => new
        {
            u.Id, u.Email, u.Nickname,
            u.State, u.City,
            Status = u.MemberStatus.ToString(),
            u.Role, u.CreatedAt
        });
        return Ok(result);
    }
}