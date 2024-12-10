namespace BackEnd.Model
{
    public class Transaction
    {
        public int IdTransaction { get; set; }
        public int IdClient { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }

        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; }
        public Client Client { get; set; }
        public ICollection<TransactionDetail> TransactionDetails { get; set; }
    }
}
