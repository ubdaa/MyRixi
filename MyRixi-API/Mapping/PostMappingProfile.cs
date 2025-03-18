using AutoMapper;
using MyRixiApi.Dto.Posts;
using MyRixiApi.Dto.Tags;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class PostMappingProfile : Profile
{
    public PostMappingProfile()
    {
        CreateMap<Post, PostResponseDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => new TagResponseDto
            {
                Id = t.Id,
                Description = t.Description
            })));
    }
}