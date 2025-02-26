using AutoMapper;
using System.Linq;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;
using MyRixiApi.Models;

public class MessageMappingProfile : Profile
{
    public MessageMappingProfile()
    {
        CreateMap<Message, MessageDto>()
            // Les propriétés Id, Content, SentAt et IsRead sont mappées automatiquement
            .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.Sender))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments))
            .ForMember(dest => dest.Reactions, opt => opt.MapFrom(src =>
                src.Reactions.GroupBy(r => r.Emoji)
                    .Select(g => new ReactionDto
                    {
                        Emoji = g.Key,
                        Count = g.Count(),
                        Users = g.SelectMany(r => r.Users.Select(u => u.Id)).ToList()
                    })));

        CreateMap<User, UserChannelDto>();
        CreateMap<Media, MediaDto>();
    }
}
