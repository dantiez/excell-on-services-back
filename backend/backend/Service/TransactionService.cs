using backend.DbContext;
using backend.DTO;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Service
{
    public class TransactionService
    {
        private readonly AppDbcontext _context;
        private readonly ILogger<TransactionService> _logger;

        public TransactionService(AppDbcontext context, ILogger<TransactionService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Create Transaction
        public async Task<TransactionDTO> CreateTransactionAsync(TransactionDTO dto)
        {
            try
            {
                var transaction = new Transaction
                {
                    Id = dto.Id,
                    transaction_date = dto.TransactionDate,
                    amount = dto.Amount,
                    payment_method = dto.PaymentMethod
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Transaction created successfully with ID: {TransactionId}", transaction.id_transaction);

                return new TransactionDTO
                {
                    IdTransaction = transaction.id_transaction,
                    Id = transaction.Id,
                    TransactionDate = transaction.transaction_date,
                    Amount = transaction.amount,
                    PaymentMethod = transaction.payment_method
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction.");
                throw;
            }
        }

        // Get Transactions by Client
        public async Task<List<TransactionDTO>> GetTransactionsByClientIdAsync(int Id)
        {
            try
            {
                return await _context.Transactions
                    .Where(t => t.Id == Id)
                    .Select(t => new TransactionDTO
                    {
                        IdTransaction = t.id_transaction,
                        Id = t.Id,
                        TransactionDate = t.transaction_date,
                        Amount = t.amount,
                        PaymentMethod = t.payment_method
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions by client ID.");
                throw;
            }
        }

        public async Task<List<TransactionDTO>> GetAllTransactionsAsync()
        {
            try
            {
                return await _context.Transactions
                    .OrderByDescending(t => t.transaction_date)
                    .Select(t => new TransactionDTO
                    {
                        IdTransaction = t.id_transaction,
                        Id = t.Id,
                        TransactionDate = t.transaction_date,
                        Amount = t.amount,
                        PaymentMethod = t.payment_method
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all transactions.");
                throw;
            }
        }

        public async Task<TransactionDTO> GetTransactionByIdAsync(int transactionId)
        {
            try
            {
                var transaction = await _context.Transactions
                    .Where(t => t.id_transaction == transactionId)
                    .Select(t => new TransactionDTO
                    {
                        IdTransaction = t.id_transaction,
                        Id = t.Id,
                        TransactionDate = t.transaction_date,
                        Amount = t.amount,
                        PaymentMethod = t.payment_method
                    })
                    .FirstOrDefaultAsync();

                return transaction;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction by ID.");
                throw;
            }
        }

        public async Task<List<TransactionDTO>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                return await _context.Transactions
                    .Where(t => t.transaction_date >= startDate && t.transaction_date <= endDate)
                    .OrderByDescending(t => t.transaction_date)
                    .Select(t => new TransactionDTO
                    {
                        IdTransaction = t.id_transaction,
                        Id = t.Id,
                        TransactionDate = t.transaction_date,
                        Amount = t.amount,
                        PaymentMethod = t.payment_method
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions by date range.");
                throw;
            }
        }
    }
}
