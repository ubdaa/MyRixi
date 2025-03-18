using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class TagRepository : GenericRepository<Tag>, ITagRepository
{
    public TagRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tag> GetOrCreateTagAsync(string description)
    {
        description = description.ToLower();
        
        var tag = _context.Tags.FirstOrDefault(t => t.Description.ToLower() == description);
        
        if (tag == null)
        {
            tag = new Tag
            {
                Description = description
            };
            
            return await CreateAsync(tag);
        }
        
        return tag;
    }

    public async Task<IEnumerable<Tag>> GetOrCreateTagsAsync(IEnumerable<string> descriptions)
    {
        var tags = new List<Tag>();
        
        foreach (var description in descriptions)
        {
            tags.Add(await GetOrCreateTagAsync(description));
        }
        
        return tags;
    }
}