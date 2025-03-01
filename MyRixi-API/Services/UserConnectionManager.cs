using MyRixiApi.Dto.Channel;
using MyRixiApi.Interfaces;
using System.Collections.Concurrent;
using AutoMapper;

namespace MyRixiApi.Services;

public class UserConnectionManager : IUserConnectionManager
{
    private readonly ConcurrentDictionary<Guid, List<string>> _userConnectionMap;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserConnectionManager(IUserRepository userRepository, IMapper mapper)
    {
        _userConnectionMap = new ConcurrentDictionary<Guid, List<string>>();
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public void AddConnection(Guid userId, string connectionId)
    {
        _userConnectionMap.AddOrUpdate(
            userId,
            new List<string> { connectionId },
            (key, connections) =>
            {
                connections.Add(connectionId);
                return connections;
            });
    }

    public void RemoveConnection(Guid userId, string connectionId)
    {
        if (_userConnectionMap.TryGetValue(userId, out var connections))
        {
            connections.Remove(connectionId);
            
            // Si l'utilisateur n'a plus de connexion, le supprimer du dictionnaire
            if (connections.Count == 0)
            {
                _userConnectionMap.TryRemove(userId, out _);
            }
        }
    }

    public List<string> GetConnections(Guid userId)
    {
        return _userConnectionMap.TryGetValue(userId, out var connections) 
            ? connections 
            : new List<string>();
    }
}