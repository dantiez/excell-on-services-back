using BackEnd.Model;
using BackEnd.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionDetailController : ControllerBase
    {
        private readonly TransactionDetaillService _transactionDetailService;

        public TransactionDetailController(TransactionDetaillService transactionDetailService)
        {
            _transactionDetailService = transactionDetailService;
        }

     
        [HttpGet("by-transaction/{idTransaction}")]
        public IActionResult GetTransactionDetailsByTransactionId(int idTransaction)
        {
            var transactionDetails = _transactionDetailService.GetTransactionDetailsByTransactionId(idTransaction);
            return Ok(transactionDetails);
        }

     
        [HttpPost("create")]
        public IActionResult CreateTransactionDetail([FromBody] TransactionDetail transactionDetail)
        {
            _transactionDetailService.CreateTransactionDetail(transactionDetail);
            return Ok("Transaction detail created successfully.");
        }

        [HttpGet("all")]
        public IActionResult GetAllTransactionDetails()
        {
            var transactionDetails = _transactionDetailService.GetAllTransactionDetails();
            return Ok(transactionDetails);
        }
    }
}
