using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface ITagRepository : IGenericRepository<Tag>
{
    Task<Tag> GetOrCreateTagAsync(string name);
    Task<IEnumerable<Tag>> GetOrCreateTagsAsync(IEnumerable<string> names);
}