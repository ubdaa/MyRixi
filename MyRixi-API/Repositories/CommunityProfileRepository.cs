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

    public async Task<CommunityProfile?> GetByUserIdAsync(Guid communityId, Guid userId)
    {
        return await _context.CommunityProfiles
            .Include(cp => cp.Community)
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);
    }
}