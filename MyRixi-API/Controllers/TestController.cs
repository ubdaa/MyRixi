using Microsoft.AspNetCore.Mvc;

namespace MyRixiApi.Controllers;

[Route("v1/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "API accessible !" });
    }
}