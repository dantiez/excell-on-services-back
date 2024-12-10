namespace BackEnd.Model
{
    public class Department
    {
        public int IdDepartment { get; set; }
        public string DepartmentName { get; set; }
        public int IdClient { get; set; }

        public Client Client { get; set; }
        public ICollection<Employee> Employees { get; set; }
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
