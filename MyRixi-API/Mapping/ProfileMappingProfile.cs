using AutoMapper;
using MyRixiApi.Dto.Profile;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class ProfileMappingProfile : Profile
{
    public ProfileMappingProfile()
    {
        // on map la date de JoinedAt de l'utilisateur
        CreateMap<UserProfile, UserProfileDto>();
        CreateMap<CommunityProfile, CommunityProfileDto>();
    }
}