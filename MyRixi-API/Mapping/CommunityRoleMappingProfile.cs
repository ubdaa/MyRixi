using AutoMapper;
using MyRixiApi.Dto.Roles;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class CommunityRoleMappingProfile : Profile
{
    public CommunityRoleMappingProfile()
    {
        CreateMap<Permission, PermissionDto>();
        
        CreateMap<CommunityRole, CommunityRoleDto>()
            .ForMember(dest => dest.RolePermissions, opt => opt.MapFrom(src => src.RolePermissions));
        
        CreateMap<RolePermission, RolePermissionDto>()
            .ForMember(dest => dest.Permission, opt => opt.MapFrom(src => src.Permission));
    }
}