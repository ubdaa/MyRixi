using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class CommunityRepository : GenericRepository<Community>, ICommunityRepository
{
    public CommunityRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Community>> GetAllAsync()
    {
        return await _context.Communities
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .ToListAsync();
    }

    public override async Task<Community?> GetByIdAsync(Guid id)
    {
        return await _context.Communities
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .Include(c => c.Rules)
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .Include(c => c.Posts)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Community>> SearchAsync(string searchTerm)
    {
        return await _context.Communities
            .Where(c => c.Name.Contains(searchTerm) || c.Description.Contains(searchTerm))
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .Include(c => c.Rules)
            .ToListAsync();
    }

    public async Task<IEnumerable<CommunityProfile>> GetMembersAsync(Guid communityId)
    {
        return await _context.CommunityProfiles
            .Where(cp => cp.CommunityId == communityId)
            .Include(cp => cp.User)
            .Include(cp => cp.ProfilePicture)
            .ToListAsync();
    }

    public async Task<CommunityProfile?> GetMemberProfileAsync(Guid communityId, Guid userId)
    {
        return await _context.CommunityProfiles
            .Include(cp => cp.User)
            .Include(cp => cp.ProfilePicture)
            .Include(cp => cp.CoverPicture)
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);
    }

    public async Task AddMemberAsync(CommunityProfile profile)
    {
        await _context.CommunityProfiles.AddAsync(profile);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateMemberRoleAsync(Guid communityId, Guid userId, string newRole)
    {
        var profile = await _context.CommunityProfiles
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);
        
        if (profile != null)
        {
            profile.Role = newRole;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveMemberAsync(Guid communityId, Guid userId)
    {
        var profile = await _context.CommunityProfiles
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);
        
        if (profile != null)
        {
            _context.CommunityProfiles.Remove(profile);
            await _context.SaveChangesAsync();
        }
    }
}