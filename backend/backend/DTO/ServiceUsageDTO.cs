namespace backend.DTO
{
    public class ServiceUsageDTO
    {
        public int IdServiceUsage { get; set; }
        public int IdEmployee { get; set; }
        public int IdService { get; set; }
        public int Id { get; set; }
        public string Status { get; set; }
        public decimal TotalFee { get; set; }
        public DateTime UsageDate { get; set; }
        public DateTime? TransactionDate { get; set; }


    }
}
