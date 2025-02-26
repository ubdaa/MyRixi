using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface ICommunityProfileRepository : IGenericRepository<CommunityProfile>
{
    Task<CommunityProfile?> GetByUserIdAsync(Guid userId);
}