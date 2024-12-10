namespace BackEnd.Model
{
    public class TransactionDetail
    {
        public int IdTransaction { get; set; }
        public int IdServiceUsage { get; set; }

        public Transaction Transaction { get; set; }
        public ServiceUsage ServiceUsage { get; set; }
    }
}
