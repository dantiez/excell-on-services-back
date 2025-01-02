using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public partial class UserDTO
    {

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string PasswordSalt { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime TS { get; set; }

        public bool Active { get; set; }

    }
    public class UpdateUser { 

        [EmailAddress]
        public string Email {get; set;}
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
    public class UpdateCurrentUser {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }



    }
    public class UserResponse : BaseResponse
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
