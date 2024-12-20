using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("error")]
    [ApiController]
    public class ErrorController : ControllerBase
    {

        [HttpGet]
        public IActionResult HandleError()
        {
            return Problem("An unexpected error occurred. Please try again later.");
        }
    }
}
