using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeDTO employeeDto)
        {
            var result = await _employeeService.CreateEmployeeAsync(employeeDto);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var result = await _employeeService.GetEmployeeByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var result = await _employeeService.GetAllEmployeesAsync();
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateEmployee([FromBody] EmployeeDTO employeeDto)
        {
            var result = await _employeeService.UpdateEmployeeAsync(employeeDto);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);
            if (!result) return NotFound();
            return Ok(result);
        }

        [HttpGet("by-client/{clientId}")]
        public async Task<IActionResult> GetEmployeesByClientId(int clientId)
        {
            var result = await _employeeService.GetEmployeesByClientIdAsync(clientId);
            if (result == null || result.Count == 0) return NotFound("No employees found for the given client.");
            return Ok(result);
        }
    }
}
