using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
    {
    [Table("Transactions")]
    public class Transaction
        {
            public int id_transaction { get; set; }
            public int Id { get; set; }
            public decimal amount { get; set; }
            public DateTime transaction_date { get; set; }
            public string payment_method { get; set; }

            public User User { get; set; }
  
        }
    }
