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
        
        CreateMap<Community, CommunityResponseDto>()
            // Pour transformer l'icone et la couverture en URL
            .ForMember(dest => dest.IconUrl, opt => opt.MapFrom(src => src.Icon.Url))
            .ForMember(dest => dest.CoverUrl, opt => opt.MapFrom(src => src.Cover.Url))
            // Exemple : Si la logique pour déterminer si la communauté est privée est externe, on peut définir ici une valeur par défaut
            .ForMember(dest => dest.IsPrivate, opt => opt.MapFrom(src => false))
            // Le mapping de la liste des règles, en supposant que vous ayez déjà configuré le mapping entre CommunityRule et CommunityRuleDto
            .ForMember(dest => dest.Rules, opt => opt.MapFrom(src => src.Rules));
    }
}