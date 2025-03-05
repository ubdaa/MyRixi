using AutoMapper;
using MyRixiApi.Dto.Roles;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class CommunityRoleMappingProfile : Profile
{
    public CommunityRoleMappingProfile()
    {
        CreateMap<CommunityRole, CommunityRoleDto>()
            .ForMember(dest => dest.RolePermissions, opt => opt.MapFrom(src => 
                src.RolePermissions.Select(rp => new RolePermissionLightDto 
                {
                    PermissionId = rp.PermissionId,
                    PermissionKey = rp.Permission.Key,
                    PermissionType = rp.Permission.Type.ToString()
                })));
    }
}