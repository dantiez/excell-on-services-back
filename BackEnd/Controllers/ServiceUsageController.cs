using BackEnd.Model;
using BackEnd.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceUsageController : ControllerBase
    {
        private readonly ServiceUsageService _serviceUsageService;

        public ServiceUsageController(ServiceUsageService serviceUsageService)
        {
            _serviceUsageService = serviceUsageService;
        }

       
        [HttpGet("all")]
        public IActionResult GetAllServiceUsages()
        {
            var serviceUsages = _serviceUsageService.GetAllServiceUsages();
            return Ok(serviceUsages);
        }

      
        [HttpGet("{id}")]
        public IActionResult GetServiceUsageById(int id)
        {
            var serviceUsage = _serviceUsageService.GetServiceUsageById(id);
            if (serviceUsage == null)
                return NotFound("ServiceUsage not found.");

            return Ok(serviceUsage);
        }

        [HttpPost("record-usage")]
        public IActionResult RecordServiceUsage(int idEmployee, int idService, int number, decimal servicePrice)
        {
            try
            {
                _serviceUsageService.CreateServiceUsage(idEmployee, idService, number, servicePrice);
                return Ok("Thông tin sử dụng dịch vụ đã được lưu thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("update")]
        public IActionResult UpdateServiceUsage([FromBody] ServiceUsage serviceUsage)
        {
            _serviceUsageService.UpdateServiceUsage(serviceUsage);
            return Ok("ServiceUsage updated successfully.");
        }

     
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteServiceUsage(int id)
        {
            _serviceUsageService.DeleteServiceUsage(id);
            return Ok("ServiceUsage deleted successfully.");
        }

        [HttpGet("total-fee-by-employee/{employeeId}")]
        public IActionResult GetTotalFeeByEmployee(int employeeId)
        {
            var totalFee = _serviceUsageService.GetTotalFeeByEmployee(employeeId);
            return Ok(totalFee);
        }
    }
}
