using BackEnd.DbContext;
using BackEnd.Model;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Service
{
    public class TransactionService
    {

        private readonly AppDbcontext _context;

        public TransactionService(AppDbcontext context)
        {
            _context = context;
        }

        public List<Transaction> GetAllTransactions()
        {
            return _context.Transaction
                .OrderByDescending(t => t.TransactionDate)
                .ToList();
        }

    
        public void CreateTransaction(Transaction transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            _context.Transaction.Add(transaction);
            _context.SaveChanges();
        }

      
     

        public List<Transaction> GetTransactionsByClientId(int idClient)
        {
            return _context.Transaction
                .Where(t => t.IdClient == idClient)
                .OrderByDescending(t => t.TransactionDate)
                .ToList();
        }

  public decimal CalculateTotalAmountForTransaction(int idTransaction)
{
    var transactionDetails = _context.TransactionDetail
        .Include(td => td.ServiceUsage)
        .Where(td => td.IdTransaction == idTransaction)
        .ToList();

    // Tính tổng số tiền từ chi tiết giao dịch
    return transactionDetails.Sum(td => td.ServiceUsage.total_fee);
}


    }
}
