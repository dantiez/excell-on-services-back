<<<<<<< HEAD
#nullable disable

using System; 
using System.Collections.Generic;

namespace backend.Model {
public partial class User
    {
        public User()
        {
            RefreshTokens = new HashSet<RefreshToken>();
           
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Ts { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
      

        public virtual ICollection<Transaction> Transactions { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }
        
                public virtual ICollection<ServiceUsage> ServiceUsages { get; set; }
    }
}
=======
#nullable disable

using System; 
using System.Collections.Generic;

namespace backend.Model {
public partial class User
    {
        public User()
        {
            RefreshTokens = new HashSet<RefreshToken>();
            Tasks = new HashSet<Task>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Ts { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
    }
}
>>>>>>> 0850cc80dacacb02344c39f69b7cbdfca09c9aa2
