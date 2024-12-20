using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/ServiceUsage")]
    [ApiController]
    public class ServiceUsageController : ControllerBase
    {
        private readonly ServiceUsageService _serviceUsageService;

        public ServiceUsageController(ServiceUsageService serviceUsageService)
        {
            _serviceUsageService = serviceUsageService;
        }

        // Get all ServiceUsages
        [HttpGet("all")]
        public async Task<IActionResult> GetAllServiceUsages()
        {
            var result = await _serviceUsageService.GetAllServiceUsagesAsync();
            return Ok(result);
        }

        // Get ServiceUsage by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceUsageById(int id)
        {
            var result = await _serviceUsageService.GetServiceUsageByIdAsync(id);
            if (result == null)
                return NotFound($"ServiceUsage with ID {id} not found.");

            return Ok(result);
        }

        // Create ServiceUsage
        [HttpPost("create")]
        public async Task<IActionResult> CreateServiceUsage([FromBody] ServiceUsageDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid ServiceUsage data.");

            var result = await _serviceUsageService.CreateServiceUsageAsync(dto);
            return CreatedAtAction(nameof(GetServiceUsageById), new { id = result.IdServiceUsage }, result);
        }

        // Update ServiceUsage
        [HttpPut("update")]
        public async Task<IActionResult> UpdateServiceUsage([FromBody] ServiceUsageDTO dto)
        {
            var result = await _serviceUsageService.UpdateServiceUsageAsync(dto);
            if (result == null)
                return NotFound("ServiceUsage not found.");

            return Ok(result);
        }

        [HttpGet("employee/{idEmployee}/client/{idClient}/hasPaidService")]
        public async Task<IActionResult> GetPaidServiceUsage(int idEmployee, int idClient)
        {
            var serviceUsage = await _serviceUsageService.GetPaidServiceUsageAsync(idEmployee, idClient);

            if (serviceUsage == null)
            {
                return NotFound(); 
            }

            return Ok(serviceUsage); 
        }


        [HttpGet("client/{idClient}/status/{status}/transactionDate")]
        public async Task<IActionResult> GetServiceUsagesByClientStatusAndDate(
    int idClient, string status, DateTime? transactionDate)
        {
            var result = await _serviceUsageService.GetServiceUsagesByClientStatusAndDateAsync(idClient, status, transactionDate);
            return Ok(result);
        }

        [HttpGet("employee/{idEmployee}/services")]
        public async Task<IActionResult> GetServicesByEmployee(int idEmployee)
        {
            try
            {
                var result = await _serviceUsageService.GetServicesByEmployeeAsync(idEmployee);
                if (result == null || !result.Any())
                    return NotFound($"No services found for employee ID {idEmployee}");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get service usages by status
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetServiceUsagesByStatus(string status)
        {
            var result = await _serviceUsageService.GetServiceUsagesByStatusAsync(status);
            if (result == null || !result.Any())
            {
                return NotFound($"No service usages found with status {status}.");
            }
            return Ok(result);
        }
        // Update ServiceUsage - Change Service ID
        [HttpPut("update-service/{idServiceUsage}")]
        public async Task<IActionResult> UpdateService(int idServiceUsage, [FromBody] int newIdService)
        {
            var result = await _serviceUsageService.UpdateServiceAsync(idServiceUsage, newIdService);
            if (result == null)
                return NotFound("ServiceUsage not found.");

            return Ok(result);
        }
        // Update ServiceUsage - Change Transaction Date
        [HttpPut("update-transaction-date/{idServiceUsage}")]
        public async Task<IActionResult> UpdateTransactionDate(int idServiceUsage, [FromBody] DateTime newTransactionDate)
        {
            var result = await _serviceUsageService.UpdateTransactionDateAsync(idServiceUsage, newTransactionDate);
            if (result == null)
                return NotFound("ServiceUsage not found.");

            return Ok(result);
        }
 

    }

}
