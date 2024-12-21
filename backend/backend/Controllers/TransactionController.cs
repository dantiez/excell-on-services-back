using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/Transaction")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // Get all transactions
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        // Create a new transaction
        [HttpPost("create")]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionDTO transactionDto)
        {
            if (transactionDto == null)
                return BadRequest("Transaction data is required.");

            var result = await _transactionService.CreateTransactionAsync(transactionDto);
            return CreatedAtAction(nameof(CreateTransaction), new { id = result.IdTransaction }, result);
        }

        // Get transactions by client ID
        [HttpGet("by-client/{idClient}")]
        public async Task<IActionResult> GetTransactionsByClientId(int idClient)
        {
            if (idClient <= 0)
                return BadRequest("Invalid client ID.");

            var transactions = await _transactionService.GetTransactionsByClientIdAsync(idClient);
            return Ok(transactions);
        }

        // Get transaction by ID
        [HttpGet("{idTransaction}")]
        public async Task<IActionResult> GetTransactionById(int idTransaction)
        {
            if (idTransaction <= 0)
                return BadRequest("Invalid transaction ID.");

            var transaction = await _transactionService.GetTransactionByIdAsync(idTransaction);

            if (transaction == null)
                return NotFound("Transaction not found.");

            return Ok(transaction);
        }

    }
}
