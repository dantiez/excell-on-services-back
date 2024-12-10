namespace BackEnd.Model
{
    public class ServiceUsage
    {
        public int IdServiceUsage { get; set; }
        public int IdEmployee { get; set; }
        public int IdDepartment { get; set; }
        public int IdService { get; set; }
        public int Number { get; set; }
        public decimal total_fee { get; set; }
        public DateTime UsageDate { get; set; }
        public Employee Employee { get; set; }
        public Department Department { get; set; }
    }
}
