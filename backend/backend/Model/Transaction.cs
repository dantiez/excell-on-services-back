namespace backend.Model
{
    public class Transaction
    {
        public int id_transaction { get; set; }
        public int id_client { get; set; }
        public decimal amount { get; set; }
        public DateTime transaction_date { get; set; }
        public string payment_method { get; set; }

        public Client Client { get; set; }
  
    }
}
