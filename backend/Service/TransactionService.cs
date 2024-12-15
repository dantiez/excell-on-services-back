using backend.DbContext;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
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
                .OrderByDescending(t => t.transaction_date)
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
                .Where(t => t.id_client == idClient)
                .OrderByDescending(t => t.transaction_date)
                .ToList();
        }
        



    }
}
