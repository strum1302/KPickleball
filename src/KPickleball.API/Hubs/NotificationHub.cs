using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace KPickleball.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        await base.OnDisconnectedAsync(exception);
    }

    // 클럽 그룹 알림
    public async Task JoinClubGroup(string clubId)
        => await Groups.AddToGroupAsync(Context.ConnectionId, $"club_{clubId}");

    public async Task LeaveClubGroup(string clubId)
        => await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"club_{clubId}");
}
