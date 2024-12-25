using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/Transaction")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly TransactionService _transactionService;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(TransactionService transactionService, ILogger<TransactionController> logger)
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        // Get all transactions
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTransactions()
        {
            try
            {
                var transactions = await _transactionService.GetAllTransactionsAsync();
                _logger.LogInformation("Retrieved all transactions.");
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all transactions.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Create a new transaction
        [HttpPost("create")]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionDTO transactionDto)
        {
            if (transactionDto == null)
            {
                _logger.LogWarning("Received empty transaction data.");
                return BadRequest("Transaction data is required.");
            }

            try
            {
                var result = await _transactionService.CreateTransactionAsync(transactionDto);
                _logger.LogInformation("Transaction created successfully with ID: {TransactionId}", result.IdTransaction);
                return CreatedAtAction(nameof(CreateTransaction), new { id = result.IdTransaction }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateTransaction action.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get transactions by client ID
        [HttpGet("by-User/{Id}")]
        public async Task<IActionResult> GetTransactionsByClientId(int Id)
        {
            if (Id <= 0)
            {
                _logger.LogWarning("Invalid client ID: {ClientId}", Id);
                return BadRequest("Invalid client ID.");
            }

            try
            {
                var transactions = await _transactionService.GetTransactionsByClientIdAsync(Id);
                _logger.LogInformation("Retrieved transactions for client ID: {ClientId}", Id);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions by client ID.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get transaction by ID
        [HttpGet("{idTransaction}")]
        public async Task<IActionResult> GetTransactionById(int idTransaction)
        {
            if (idTransaction <= 0)
            {
                _logger.LogWarning("Invalid transaction ID: {TransactionId}", idTransaction);
                return BadRequest("Invalid transaction ID.");
            }

            try
            {
                var transaction = await _transactionService.GetTransactionByIdAsync(idTransaction);

                if (transaction == null)
                {
                    _logger.LogWarning("Transaction not found for ID: {TransactionId}", idTransaction);
                    return NotFound("Transaction not found.");
                }

                _logger.LogInformation("Retrieved transaction with ID: {TransactionId}", idTransaction);
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction by ID.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("by-date-range")]
        public async Task<IActionResult> GetTransactionsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate == null || endDate == null)
            {
                _logger.LogWarning("Both start and end dates are required.");
                return BadRequest("Both start and end dates are required.");
            }

            try
            {
                var transactions = await _transactionService.GetTransactionsByDateRangeAsync(startDate, endDate);
                _logger.LogInformation("Retrieved transactions by date range.");
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions by date range.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
