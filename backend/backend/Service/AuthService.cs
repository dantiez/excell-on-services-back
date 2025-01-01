using backend.DbContext;
using backend.DTO;
using backend.Helpers;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class AuthService
    {
        private readonly AppDbcontext ctx;
        private readonly TokenService tokenService;

        public AuthService(AppDbcontext _context, TokenService tokenService)
        {
            this.ctx = _context;
            this.tokenService = tokenService;
        }

        public async Task<UserResponse> GetInfoAsync(int userId)
        {
            var user = await ctx.Users.FindAsync(userId);

            if (user == null)
            {
                return new UserResponse
                {
                    Success = false,
                    Error = "No user found",
                    ErrorCode = "I001",
                };
            }

            return new UserResponse
            {
                Success = true,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreationDate = user.Ts,
            };
        }

        public async Task<TokenResponseDTO> LoginAsync(LoginRequest loginRequest)
        {
            var user = ctx.Users.SingleOrDefault(user => user.Email == loginRequest.Email);
            if (user == null)
            {
                return new TokenResponseDTO
                {
                    Success = false,
                    Error = "Email not found",
                    ErrorCode = "L02",
                };
            }
            var passwordHash = PasswordHelper.HashUsingPbkdf2(
                loginRequest.Password,
                Convert.FromBase64String(user.PasswordSalt)
            );
            if (user.Password != passwordHash)
            {
                return new TokenResponseDTO
                {
                    Success = false,
                    Error = "Invalid Password",
                    ErrorCode = "L03",
                };
            }
            var token = await System.Threading.Tasks.Task.Run(
                () => tokenService.GenerateTokenAsync(user.Id)
            );
            return new TokenResponseDTO
            {
                Success = true,
                AccessToken = token.Item1,
                RefreshToken = token.Item2,
                UserId = user.Id,
                isAdmin = user.Active,
            };
        }

        public async Task<LogoutReponse> LogoutAsync(int userId)
        {
            var refreshToken = await ctx.RefreshTokens.FirstOrDefaultAsync(o => o.UserId == userId);
            if (refreshToken == null)
            {
                return new LogoutReponse { Success = true };
            }
            ctx.RefreshTokens.Remove(refreshToken);
            var saveResponse = await ctx.SaveChangesAsync();
            if (saveResponse >= 0)
            {
                return new LogoutReponse { Success = true };
            }
            return new LogoutReponse
            {
                Success = false,
                Error = "Unable to logout user",
                ErrorCode = "L04",
            };
        }

        public async Task<SignUpResponse> SignupAsync(SignUpRequest signupRequest)
        {
            var existingUser = await ctx.Users.SingleOrDefaultAsync(user =>
                user.Email == signupRequest.Email
            );
            if (existingUser != null)
            {
                return new SignUpResponse
                {
                    Success = false,
                    Error = "User already exists with the same email",
                    ErrorCode = "S02",
                };
            }
            if (signupRequest.Password != signupRequest.ConfirmPassword)
            {
                return new SignUpResponse
                {
                    Success = false,
                    Error = "Password and confirm password do not match",
                    ErrorCode = "S03",
                };
            }
            var salt = PasswordHelper.GetSecureSalt();
            var passwordHash = PasswordHelper.HashUsingPbkdf2(signupRequest.Password, salt);
            var user = new User
            {
                Email = signupRequest.Email,
                Password = passwordHash,
                PasswordSalt = Convert.ToBase64String(salt),
                FirstName = signupRequest.FirstName,
                LastName = signupRequest.LastName,
                Ts = DateTime.Now,
                Active = signupRequest.isAdmin, // You can save is false and send confirmation email to the user, then once the user confirms the email you can make it true
            };
            await ctx.Users.AddAsync(user);
            var saveResponse = await ctx.SaveChangesAsync();
            if (saveResponse >= 0)
            {
                return new SignUpResponse { Success = true, Email = user.Email };
            }
            return new SignUpResponse
            {
                Success = false,
                Error = "Unable to save the user",
                ErrorCode = "S05",
            };
        }
    }
}
