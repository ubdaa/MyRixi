using Microsoft.AspNetCore.Mvc;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class ChatController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}