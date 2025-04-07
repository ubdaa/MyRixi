using AutoMapper;
using MyRixiApi.Dto.Attachments;
using MyRixiApi.Dto.Comments;
using MyRixiApi.Dto.Media;
using MyRixiApi.Dto.Posts;
using MyRixiApi.Dto.Tags;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class PostMappingProfile : Profile
{
    public PostMappingProfile()
    {
        CreateMap<Post, PostResponseDto>()
            // Mapper les propriétés existantes
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => new TagResponseDto
            {
                Id = t.Id,
                Description = t.Name
            })))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Select(a => new AttachmentResponseDto
            {
                Id = a.Id,
                MediaId = a.MediaId,
                Media = new MediaDto
                {
                    Id = a.Media.Id,
                    Type = a.Media.Type,
                    Url = a.Media.Url
                }
            })))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.CommunityProfile.User.Id))
            .ForMember(dest => dest.AuthorId, opt => opt.MapFrom(src => src.CommunityProfile.Id))
            // Mapper les informations de l'auteur
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => new AuthorDto
            {
                Id = src.CommunityProfile.Id,
                Username = src.CommunityProfile.User.UserName,
                DisplayName = src.CommunityProfile.User.UserName, // Utilisez le champ approprié si vous avez un DisplayName
                ProfileImageUrl = src.CommunityProfile.ProfilePicture.Url ?? string.Empty
            }))
            // Mapper l'ID de la communauté
            .ForMember(dest => dest.CommunityId, opt => opt.MapFrom(src => src.CommunityId))
            // Mapper le nom de la communauté
            .ForMember(dest => dest.CommunityName, opt => opt.MapFrom(src => src.Community.Name))
            // Mapper l'état du post
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
            // Mapper le nombre de commentaires
            .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count))
            // Mapper les commentaires détaillés
            .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => 
                src.Comments.Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                })
            ))
            // Mapper le nombre de likes (à ajuster selon votre modèle de données)
            .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.Likes != null ? src.Likes.Count : 0))
            // La propriété IsLiked nécessite le userId actuel, donc vous devrez la gérer différemment
            .ForMember(dest => dest.IsLiked, opt => opt.Ignore());
    }
}