namespace BackEnd.Model
{
    public class Client
    {

        public int IdClient { get; set; }
        public string NameClient { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }

        public ICollection<Department> Departments { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
    }
}
