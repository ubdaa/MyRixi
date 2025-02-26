using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IUserProfileRepository : IGenericRepository<UserProfile>
{
    Task<UserProfile?> GetByUserIdAsync(Guid userId);
}