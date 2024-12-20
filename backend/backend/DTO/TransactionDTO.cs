namespace backend.DTO
{
    public class TransactionDTO
    {
        public int IdTransaction { get; set; }
        public int IdClient { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string PaymentMethod { get; set; }
    }
}
