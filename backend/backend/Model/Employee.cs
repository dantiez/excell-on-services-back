namespace backend.Model
{
    public class Employee
    {
        public int id_employee { get; set; }
        public int age { get; set; }
        public string sex { get; set; }
        public string phone_number { get; set; }
        public string position { get; set; }
        public decimal wage { get; set; }

         public string name { get; set; }

        public int Id { get; set; }
        public User User { get; set; }  

        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
