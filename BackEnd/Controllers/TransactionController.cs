    using BackEnd.Model;
    using BackEnd.Service;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    namespace BackEnd.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class TransactionController : ControllerBase
        {
            private readonly TransactionService _transactionService;

            public TransactionController(TransactionService transactionService)
            {
                _transactionService = transactionService;
            }

            [HttpGet("all")]
            public IActionResult GetAllTransactions()
            {
                var transactions = _transactionService.GetAllTransactions();
                return Ok(transactions);
            }

            [HttpPost("create")]
            public IActionResult CreateTransaction([FromBody] Transaction transaction)
            {
                _transactionService.CreateTransaction(transaction);
                return Ok("Transaction created successfully.");
            }



            [HttpGet("by-client/{idClient}")]
            public IActionResult GetTransactionsByClientId(int idClient)
            {
                var transactions = _transactionService.GetTransactionsByClientId(idClient);
                return Ok(transactions);
            }


            [HttpGet("calculate-total/{idTransaction}")]
            public IActionResult CalculateTotalAmount(int idTransaction)
            {
                try
                {
                    var totalAmount = _transactionService.CalculateTotalAmountForTransaction(idTransaction);
                    return Ok(new { TotalAmount = totalAmount });
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

        }
    }
