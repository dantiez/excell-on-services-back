using backend.Model;
    using backend.Service;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    namespace backend.Controllers
    {
        [Route("api/Transaction/")]
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



        }
    }
