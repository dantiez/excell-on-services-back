using backend.DbContext;
using backend.DTO;
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

        // Create Transaction
        public async Task<TransactionDTO> CreateTransactionAsync(TransactionDTO dto)
        {
            var transaction = new Transaction
            {
                id_client = dto.IdClient,
                transaction_date = dto.TransactionDate,
                amount = dto.Amount,
                payment_method = dto.PaymentMethod
            };

            _context.Transaction.Add(transaction);
            await _context.SaveChangesAsync();

            return new TransactionDTO
            {
                IdTransaction = transaction.id_transaction,
                IdClient = transaction.id_client,
                TransactionDate = transaction.transaction_date,
                Amount = transaction.amount,
                PaymentMethod = transaction.payment_method
            };
        }

        // Get Transactions by Client
        public async Task<List<TransactionDTO>> GetTransactionsByClientIdAsync(int clientId)
        {
            return await _context.Transaction
                .Where(t => t.id_client == clientId)
                .Select(t => new TransactionDTO
                {
                    IdTransaction = t.id_transaction,
                    IdClient = t.id_client,
                    TransactionDate = t.transaction_date,
                    Amount = t.amount,
                    PaymentMethod = t.payment_method
                }).ToListAsync();
        }

        // Get All Transactions
        public async Task<List<TransactionDTO>> GetAllTransactionsAsync()
        {
            return await _context.Transaction
                .OrderByDescending(t => t.transaction_date)
                .Select(t => new TransactionDTO
                {
                    IdTransaction = t.id_transaction,
                    IdClient = t.id_client,
                    TransactionDate = t.transaction_date,
                    Amount = t.amount,
                    PaymentMethod = t.payment_method
                }).ToListAsync();
        }

        public async Task<TransactionDTO> GetTransactionByIdAsync(int transactionId)
        {
            var transaction = await _context.Transaction
                .Where(t => t.id_transaction == transactionId)
                .Select(t => new TransactionDTO
                {
                    IdTransaction = t.id_transaction,
                    IdClient = t.id_client,
                    TransactionDate = t.transaction_date,
                    Amount = t.amount,
                    PaymentMethod = t.payment_method
                })
                .FirstOrDefaultAsync();

            return transaction;
        }

    }
}
