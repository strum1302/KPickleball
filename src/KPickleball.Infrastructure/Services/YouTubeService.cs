using KPickleball.Application.Interfaces;

namespace KPickleball.Infrastructure.Services;

public class YouTubeService : IYouTubeService
{
    // YouTube video ID는 11자리 영숫자+특수문자
    public bool IsValidVideoId(string videoId)
    {
        if (string.IsNullOrWhiteSpace(videoId)) return false;
        return System.Text.RegularExpressions.Regex.IsMatch(
            videoId, @"^[a-zA-Z0-9_-]{11}$");
    }

    // YouTube 표준 썸네일 URL (API 호출 없이 생성)
    public Task<string?> GetThumbnailUrlAsync(string videoId)
    {
        if (!IsValidVideoId(videoId))
            return Task.FromResult<string?>(null);

        // hqdefault = 480x360, maxresdefault = 1280x720 (없을 수도 있음)
        var url = $"https://img.youtube.com/vi/{videoId}/hqdefault.jpg";
        return Task.FromResult<string?>(url);
    }
}
