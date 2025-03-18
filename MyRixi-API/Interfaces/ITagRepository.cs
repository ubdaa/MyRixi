using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface ITagRepository : IGenericRepository<Tag>
{
    Task<Tag> GetOrCreateTagAsync(string description);
    Task<IEnumerable<Tag>> GetOrCreateTagsAsync(IEnumerable<string> descriptions);
}