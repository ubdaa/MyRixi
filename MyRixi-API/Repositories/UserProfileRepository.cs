using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class UserProfileRepository : GenericRepository<UserProfile>, IUserProfileRepository
{
    public UserProfileRepository(ApplicationDbContext context) : base(context)
    {
    }

    // on réécrit getbyidasync
    public override async Task<UserProfile?> GetByIdAsync(Guid id)
    {
        return await _context.UserProfiles
            .Include(up => up.User)
            .Include(up => up.ProfilePicture)
            .Include(up => up.CoverPicture)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
    
    public async Task<UserProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserProfiles
            .Include(up => up.User)
            .Include(up => up.ProfilePicture)
            .Include(up => up.CoverPicture)
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }
}