using AutoMapper;
using MyRixiApi.Dto.Comment;
using MyRixiApi.Dto.Comments;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class CommentMappingProfile : Profile
{
    public CommentMappingProfile()
    {
        CreateMap<Comment, CommentResponseDto>()
            .ForMember(dest => dest.ProfileName, opt => opt.MapFrom(src => src.Sender != null ? src.Sender.DisplayName : null))
            .ForMember(dest => dest.Replies, opt => opt.MapFrom(src => src.Replies));
            
        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.PostedAt, opt => opt.MapFrom(src => src.PostedAt))
            .ForMember(dest => dest.ParentCommentId, opt => opt.MapFrom(src => src.ParentCommentId))
            .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => src.PostId))
            .ForMember(dest => dest.ProfileId, opt => opt.MapFrom(src => src.SenderId))
            .ForMember(dest => dest.ProfileDisplayName, opt => opt.MapFrom(src => src.Sender != null ? src.Sender.DisplayName : string.Empty))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.Sender != null ? src.Sender.ProfilePicture.Url : string.Empty))
            .ForMember(dest => dest.RepliesCount, opt => opt.MapFrom(src => src.Replies.Count))
            .ForMember(dest => dest.IsOwner, opt => opt.Ignore()); // IsOwner sera déterminé dans le service
            
        // Si vous avez besoin d'un DTO pour la création de commentaires, ajoutez-le ici
        // CreateMap<CommentCreateDto, Comment>();
        
        // Si vous avez besoin d'un DTO pour la mise à jour de commentaires, ajoutez-le ici
        // CreateMap<CommentUpdateDto, Comment>();
    }
}
