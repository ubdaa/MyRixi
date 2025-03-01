using MyRixiApi.Dto.Channel;

namespace MyRixiApi.Interfaces;

public interface IUserConnectionManager
{
    void AddConnection(Guid userId, string connectionId);
    void RemoveConnection(Guid userId, string connectionId);
    List<string> GetConnections(Guid userId);
    //Task<UserChannelDto> GetUserInfoAsync(Guid userId);
}