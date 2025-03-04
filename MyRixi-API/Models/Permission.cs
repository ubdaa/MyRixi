namespace MyRixiApi.Models;

public class Permission
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty; 
    public PermissionType Type { get; set; }
}

public enum PermissionType
{
    CanManageChannels,
    CanKickMembers,
    CanBanMembers,
    CanModerateChat,
    CanEditCommunitySettings,
    CanPinMessages,
    CanCreateEvents,
    CanManageRoles,
    IsAdministrator
}