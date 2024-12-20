namespace backend.Model
{
    public class Services
    {
        public int id_services { get; set; }
        public string name_service { get; set; }
        public string content { get; set; }
        public decimal price { get; set; }

      
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
