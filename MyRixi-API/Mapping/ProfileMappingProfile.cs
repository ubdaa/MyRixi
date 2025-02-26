using AutoMapper;
using MyRixiApi.Dto.Profile;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class ProfileMappingProfile : Profile
{
    public ProfileMappingProfile()
    {
        CreateMap<UserProfile, UserProfileDto>();
        CreateMap<CommunityProfile, CommunityProfileDto>();
    }
}