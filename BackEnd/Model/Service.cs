namespace BackEnd.Model
{
    public class Service
    {
        public int IdService { get; set; }
        public string NameService { get; set; }
        public string Content { get; set; }
        public decimal Price { get; set; }

       
        public ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
