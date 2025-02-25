using AutoMapper;
using MyRixiApi.Dto.Community;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class CommunityMappingProfile : Profile
{
    public CommunityMappingProfile()
    {
        CreateMap<User, CommunityProfile>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Pseudonym, opt => opt.MapFrom(src => src.UserProfile.DisplayName))
            .ForMember(dest => dest.ProfilePictureId, opt => opt.MapFrom(src => src.UserProfile.ProfilePictureId))
            .ForMember(dest => dest.CoverPictureId, opt => opt.MapFrom(src => src.UserProfile.CoverPictureId));
        
        CreateMap<CommunityRule, CommunityRuleDto>();
        
        CreateMap<CommunityProfile, CommuntiyProfileResponseDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.CommunityName, opt => opt.MapFrom(src => src.Community.Name))
            .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count));
        
        CreateMap<Community, CommunityResponseDto>()
            // Pour transformer l'icone et la couverture en URL
            .ForMember(dest => dest.IconUrl, opt => opt.MapFrom(src => src.Icon.Url))
            .ForMember(dest => dest.CoverUrl, opt => opt.MapFrom(src => src.Cover.Url))
            // Exemple : Si la logique pour déterminer si la communauté est privée est externe, on peut définir ici une valeur par défaut
            .ForMember(dest => dest.IsPrivate, opt => opt.MapFrom(src => false))
            // Le mapping de la liste des règles, en supposant que vous ayez déjà configuré le mapping entre CommunityRule et CommunityRuleDto
            .ForMember(dest => dest.Rules, opt => opt.MapFrom(src => src.Rules));
        
        // Mapping de Community vers CommunityResponseDto
        CreateMap<Community, JoinedCommunityResponseDto>()
            // Mapping des icônes et couvertures en URL
            .ForMember(dest => dest.IconUrl, opt => opt.MapFrom(src => src.Icon.Url))
            .ForMember(dest => dest.CoverUrl, opt => opt.MapFrom(src => src.Cover.Url))
            // On garde la valeur d'IsPrivate provenant du modèle
            .ForMember(dest => dest.IsPrivate, opt => opt.MapFrom(src => src.IsPrivate))
            .ForMember(dest => dest.Rules, opt => opt.MapFrom(src => src.Rules))
            // Mapping personnalisé pour la propriété "Member"
            .ForMember(dest => dest.Profile, opt => opt.MapFrom((src, dest, destMember, context) =>
            {
                // On attend que le CurrentUserId soit passé dans le contexte
                if (context.Items.TryGetValue("CurrentUserId", out object? currentUserIdObj) &&
                    currentUserIdObj is Guid currentUserId)
                {
                    var memberProfile = src.Members.FirstOrDefault(m => m.UserId == currentUserId);
                    // On retourne null si aucun profil trouvé
                    return memberProfile != null ? context.Mapper.Map<CommuntiyProfileResponseDto>(memberProfile) : null;
                }
                return null;
            }));
    }
}