using BackEnd.DbContext;
using BackEnd.Model;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Service
{
    public class TransactionDetaillService
    {
        private readonly AppDbcontext _context;

        public TransactionDetaillService(AppDbcontext context)
        {
            _context = context;
        }

    
        public List<TransactionDetail> GetTransactionDetailsByTransactionId(int idTransaction)
        {
            return _context.TransactionDetail
                .Where(td => td.IdTransaction == idTransaction)
                .Include(td => td.ServiceUsage) 
                .Include(td => td.Transaction)  
                .ToList();
        }

  
        public void CreateTransactionDetail(TransactionDetail transactionDetail)
        {
            if (transactionDetail == null)
            {
                throw new ArgumentNullException(nameof(transactionDetail));
            }

            _context.TransactionDetail.Add(transactionDetail);
            _context.SaveChanges();
        }

    
        public List<TransactionDetail> GetAllTransactionDetails()
        {
            return _context.TransactionDetail
                .Include(td => td.ServiceUsage)  
                .Include(td => td.Transaction)  
                .ToList();
        }
    }
}
