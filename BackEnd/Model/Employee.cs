namespace BackEnd.Model
{
    public class Employee
    {
        public int IdEmployee { get; set; }
        public string NameEmployee { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public string PhoneNumber { get; set; }
        public string Position { get; set; }
        public decimal Wage { get; set; }
        public int IdDepartment { get; set; }

        public Department Department { get; set; }
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
