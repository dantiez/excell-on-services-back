﻿namespace backend.DTO
{
    public class UserDTO
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
}
