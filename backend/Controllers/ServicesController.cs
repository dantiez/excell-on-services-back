using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Services")]
    public class ServicesController : ControllerBase
    {
        private readonly ServicesService _servicesService;

        public ServicesController(ServicesService servicesService)
        {
            _servicesService = servicesService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDTO serviceDto)
        {
            var result = await _servicesService.CreateServiceAsync(serviceDto);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var result = await _servicesService.GetServiceByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllServices()
        {
            var result = await _servicesService.GetAllServicesAsync();
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateService([FromBody] ServiceDTO serviceDto)
        {
            var result = await _servicesService.UpdateServiceAsync(serviceDto);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var result = await _servicesService.DeleteServiceAsync(id);
            if (result == "Service deleted successfully.")
                return Ok(new { message = result });
            return BadRequest(new { message = result });
        }
    }
}
