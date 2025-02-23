using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public override async Task<User?> GetByIdAsync(Guid id)
    {
        // Include related entities
        return await _context.Users
            .Include(u => u.UserProfile)
            .ThenInclude(u => u.ProfilePicture)
            .Include(u => u.UserProfile)
            .ThenInclude(u => u.CoverPicture)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}