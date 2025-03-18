using AutoMapper;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public class ChannelMappingProfile : Profile
{
    public ChannelMappingProfile()
    {
        CreateMap<Channel, ChannelDetailDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            // Les propriétés Id, Description, Description, IsPrivate et CommunityId sont mappées automatiquement
            .ForMember(dest => dest.Participants, opt => opt.MapFrom(src => src.Participants))
            .ForMember(dest => dest.Messages, opt => opt.MapFrom(src => src.Messages));
        
        CreateMap<Channel, ChannelDto>()
            // Mapping automatique pour Id, Description, Description, IsPrivate et CommunityId
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.ParticipantCount, opt => opt.MapFrom(src => src.Participants.Count));

        CreateMap<User, UserChannelDto>()
            .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.UserProfile.ProfilePicture.Url));
        
        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.Sender))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments))
            .ForMember(dest => dest.Reactions, opt => opt.MapFrom(src => 
                src.Reactions
                    .GroupBy(r => r.Emoji)
                    .Select(g => new ReactionDto
                    {
                        Emoji = g.Key,
                        Count = g.Count(),
                        Users = g.SelectMany(r => r.Users.Select(u => u.Id)).ToList()
                    })));

        CreateMap<Media, MediaDto>();
    }
}