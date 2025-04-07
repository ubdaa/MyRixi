using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class TagRepository : GenericRepository<Tag>, ITagRepository
{
    public TagRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tag> GetOrCreateTagAsync(string name)
    {
        name = name.ToLower();
        
        var tag = _context.Tags.FirstOrDefault(t => t.Name.ToLower() == name);
        
        if (tag == null)
        {
            tag = new Tag
            {
                Name = name
            };
            
            return await CreateAsync(tag);
        }
        
        return tag;
    }

    public async Task<IEnumerable<Tag>> GetOrCreateTagsAsync(IEnumerable<string> names)
    {
        var tags = new List<Tag>();
        
        foreach (var name in names)
        {
            tags.Add(await GetOrCreateTagAsync(name));
        }
        
        return tags;
    }
}