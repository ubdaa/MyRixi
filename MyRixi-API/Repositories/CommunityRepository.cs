using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class CommunityRepository : GenericRepository<Community>, ICommunityRepository
{
    private readonly ICommunityRoleRepository _roleRepository;
    
    public CommunityRepository(ApplicationDbContext context, ICommunityRoleRepository roleRepository) : base(context)
    {
        _roleRepository = roleRepository;
    }
    
    public override async Task<Community> CreateAsync(Community entity)
    {
        await _context.Communities.AddAsync(entity);
        await _context.SaveChangesAsync();
        
        // Créer les rôles de base
        await _roleRepository.AddCommunityBaseRolesAsync(entity.Id);
        
        return entity;
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
            .Include(c => c.Roles)
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .Include(c => c.Posts)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public Task<Community?> GetCommunityAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Community>> SearchAsync(string searchTerm)
    {
        return await _context.Communities
            .Where(c => c.Name.Contains(searchTerm) || c.Description.Contains(searchTerm))
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .Include(c => c.Rules)
            .Include(c => c.Roles)
            .ToListAsync();
    }

    public async Task<IEnumerable<Community>> GetCommunitiesAsync(int page, int size)
    {
        return await _context.Communities
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .Include(c => c.Rules)
            .Include(c => c.Roles)
            .Skip((page - 1) * size)
            .Take(size)
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

    public async Task<IEnumerable<Community>> GetJoinedCommunitiesAsync(Guid userId)
    {
        // on inclut aussi le profile de la communauté pour avoir les informations sur le membre
        return await _context.Communities
            .Where(c => c.Members.Any(m => m.UserId == userId && m.JoinStatus == JoinStatus.Accepted))
            .Include(c => c.Icon)
            .Include(c => c.Cover)
            .Include(c => c.Rules)
            .Include(c => c.Roles)
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
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

    public async Task UpdateMemberRoleAsync(Guid communityId, Guid userId, CommunityRole newRole)
    {
        var profile = await _context.CommunityProfiles
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);
        
        if (profile != null)
        {
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateMemberStatusAsync(Guid communityId, Guid userId, JoinStatus status)
    {
        var profile = await _context.CommunityProfiles
            .FirstOrDefaultAsync(cp => cp.CommunityId == communityId && cp.UserId == userId);

        if (profile != null)
        {
            profile.JoinStatus = status;
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

    public Task IsMemberAsync(Guid communityId, Guid userId)
    {
        var profile = _context.CommunityProfiles
            .FirstOrDefault(cp => cp.CommunityId == communityId && cp.UserId == userId);
        
        return Task.FromResult(profile != null);
    }
}