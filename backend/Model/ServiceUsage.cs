namespace backend.Model
{
    using System.Text.Json.Serialization;

    public class ServiceUsage
    {
        public int id_service_usage { get; set; }
        public int id_employee { get; set; }
        public int id_service { get; set; }
        public int id_client { get; set; }
        public string status { get; set; }
        public decimal total_fee { get; set; }
        public DateTime usage_date { get; set; }
        public DateTime? transaction_date { get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; }

        [JsonIgnore]
        public Client Client { get; set; }

        [JsonIgnore]
        public Services Service { get; set; }
    }
}
