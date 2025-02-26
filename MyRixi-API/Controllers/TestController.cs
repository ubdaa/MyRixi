using Microsoft.AspNetCore.Mvc;

namespace MyRixiApi.Controllers;

public class TestController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}