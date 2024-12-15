using System.Text.Json.Serialization;

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
        public int id_department { get; set; }



        [JsonIgnore]
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
