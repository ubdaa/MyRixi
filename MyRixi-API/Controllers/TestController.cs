using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Interfaces;
using MyRixiApi.Utilities;

namespace MyRixiApi.Controllers;

[Route("v1/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private IStorageService _storageService;
    
    public TestController(IStorageService storageService)
    {
        _storageService = storageService;
    }
    
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "API accessible !" });
    }
    
    [HttpGet("image-generator")]
    public IActionResult ImageGenerator()
    {
        
        var url = ProfilePictureGenerator.GenerateRandomProfilePictureAsync(_storageService, Guid.NewGuid());
        return Ok(new { message = url });
    }
}