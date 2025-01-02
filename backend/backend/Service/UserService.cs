using backend.DbContext;
using backend.DTO;
using backend.Model;
using backend.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Service
{
    public class UserService
    {
        private readonly AppDbcontext _context;

        public UserService(AppDbcontext context)
        {
            _context = context;
        }

        // Get all users
        public IEnumerable<UserDTO> GetAllUsers()
        {
            return _context.Users.Select(user => new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password,
                PasswordSalt = user.PasswordSalt,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TS = user.Ts,
                Active = user.Active
            }).ToList();
        }

        // Get a user by ID
        public UserDTO GetUserById(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return null;

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password,
                PasswordSalt = user.PasswordSalt,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TS = user.Ts,
                Active = user.Active
            };
        }

        // Create a new user
        public void CreateUser(UserDTO userDto)
        {
            var user = new User
            {
                Email = userDto.Email,
                Password = userDto.Password,
                PasswordSalt = userDto.PasswordSalt,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Ts = DateTime.Now,
                Active = userDto.Active
            };

            _context.Users.Add(user);
            _context.SaveChanges();
        }

        // Update an existing user
        public bool UpdateUser(int id, UpdateUser userDto)
        {
            var user = _context.Users.Find(id);
            
                if (user == null) return false;
            user.Email = userDto.Email;
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Ts = DateTime.Now;

            _context.Users.Update(user);
            _context.SaveChanges();
            return true;
        }
        public SignUpResponse UpdateCurrentUser(int id, UpdateCurrentUser userDto){
            var user = _context.Users.Find(id);
            if(user ==null) {
                return new SignUpResponse {
                Success = false,
                Error = "No User", 
                ErrorCode = "503"
                };
            }
                if (userDto.Password != userDto.ConfirmPassword)
                {
                    return new SignUpResponse
                    {
                        Success = false,
                        Error = "Password and confirm password do not match",
                        ErrorCode = "S03",
                    };
                }
                var salt = PasswordHelper.GetSecureSalt();
                var passwordHash = PasswordHelper.HashUsingPbkdf2(userDto.Password, salt);
            user.Email = userDto.Email;
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Password = passwordHash; 
            user.PasswordSalt = Convert.ToBase64String(salt);
            user.Ts = DateTime.Now;

            _context.Users.Update(user);
            _context.SaveChanges();
            return new SignUpResponse {
                Success = true, 
                        Email = user.Email
            };
        }


        // Delete a user
        public  bool DeleteUser(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null ) return false;
            var token = _context.RefreshTokens.FirstOrDefault(e => e.UserId == user.Id); 
        if (token != null) {

           _context.RefreshTokens.Remove(token);
        }
        _context.Users.Remove(user);
            
            _context.SaveChanges();
            return true;
        }
    }
}
