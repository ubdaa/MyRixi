using AutoMapper;
using MyRixiApi.Dto.Attachments;
using MyRixiApi.Dto.Comments;
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
            })))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Select(a => new AttachmentResponseDto
            {
                Id = a.Id,
                MediaId = a.MediaId
            })))
            .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => 
                src.Comments.Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                })
            ));
    }
}