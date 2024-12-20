namespace backend.Model
{
    public class Client
    {
        public int id_Client { get; set; }
        public string name_Client { get; set; }
        public string phone_number { get; set; }
        public string address { get; set; }
        public string email { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
        public ICollection<Employee> Employees { get; set; }
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }

}
