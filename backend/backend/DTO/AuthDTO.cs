
using System.ComponentModel.DataAnnotations;
namespace backend.DTO {

    public class LoginRequest { 
            public string Email {get;set;}
            public string Password {get;set;}

    }

    public class SignUpRequest {
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
        [Required]
        public DateTime Ts { get; set; }
    }



}
