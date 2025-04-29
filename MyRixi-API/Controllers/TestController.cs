using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Interfaces;
using MyRixiApi.Utilities;

namespace MyRixiApi.Controllers;

[Route("v1/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private IStorageService _storageService;
    private readonly IEmailSender _emailSender;

    public TestController(IStorageService storageService, IEmailSender emailSender)
    {
        _storageService = storageService;
        _emailSender = emailSender;
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

    [HttpGet("test-mail")]
    public IActionResult TestMail([FromQuery] string email)
    {
        var subject = "Test Email";
        var htmlMessage = "<h1>Hello</h1><p>This is a test email.</p>";
        
        _emailSender.SendEmailAsync(email, subject, htmlMessage);
        
        return Ok(new { message = "Email sent" });
    }
}