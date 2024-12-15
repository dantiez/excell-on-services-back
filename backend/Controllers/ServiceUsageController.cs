using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using System;

namespace backend.Controllers
{
    [Route("api/serviceusage/")]
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
            try
            {
                var serviceUsages = _serviceUsageService.GetAllServiceUsages();
                return Ok(serviceUsages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("status/{status}")]
        public IActionResult GetServiceUsagesByStatus(string status)
        {
            try
            {
                if (string.IsNullOrEmpty(status))
                {
                    return BadRequest("Status parameter is required.");
                }

                var serviceUsages = _serviceUsageService.GetServiceUsagesByStatus(status);
                return Ok(serviceUsages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetServiceUsageById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid ID.");
                }

                var serviceUsage = _serviceUsageService.GetServiceUsageById(id);
                if (serviceUsage == null)
                {
                    return NotFound("ServiceUsage not found.");
                }

                return Ok(serviceUsage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("record-usage")]
        public IActionResult RecordServiceUsage([FromQuery] int idEmployee, [FromQuery] int idService, [FromQuery] decimal servicePrice, [FromQuery] string status)
        {
            try
            {
                if (idEmployee <= 0 || idService <= 0 || servicePrice <= 0 || string.IsNullOrEmpty(status))
                {
                    return BadRequest("Invalid input parameters.");
                }

                _serviceUsageService.CreateServiceUsage(idEmployee, idService, servicePrice, status);
                return Ok("Service usage recorded successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPut("update")]
        public IActionResult UpdateServiceUsage([FromBody] ServiceUsage serviceUsage)
        {
            try
            {
                if (serviceUsage == null || serviceUsage.id_service_usage <= 0)
                {
                    return BadRequest("Invalid ServiceUsage data.");
                }

                _serviceUsageService.UpdateServiceUsage(serviceUsage);
                return Ok("ServiceUsage updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        // 1. Get ServiceUsage by id_client, status, and transaction_date
        [HttpGet("by-client-status-date")]
        public IActionResult GetServiceUsagesByClient(int idClient, string status, DateTime? transactionDate)
        {
            try
            {
                var serviceUsages = _serviceUsageService.GetServiceUsagesByClient(idClient, status, transactionDate);
                return Ok(serviceUsages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // 3. Update transaction_date
        [HttpPut("update-transaction-date/{idServiceUsage}")]
        public IActionResult UpdateTransactionDate(int idServiceUsage, [FromBody] DateTime newTransactionDate)
        {
            try
            {
                _serviceUsageService.UpdateTransactionDate(idServiceUsage, newTransactionDate);
                return Ok("Transaction date updated successfully.");
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
