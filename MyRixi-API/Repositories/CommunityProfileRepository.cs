using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class CommunityProfileRepository : GenericRepository<CommunityProfile>, ICommunityProfileRepository
{
    public CommunityProfileRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CommunityProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.CommunityProfiles.FirstOrDefaultAsync(x => x.UserId == userId);
    }
}