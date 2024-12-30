using Microsoft.EntityFrameworkCore; 
using backend.DbContext;
using backend.Helpers;
using backend.Model;
using backend.DTO;


namespace backend.Service {

    public class TokenService { 
        private readonly AppDbcontext dbContext; 

        public TokenService(AppDbcontext appDbContext) {
            this.dbContext = appDbContext; 
        }

        public async Task<Tuple<string, string>> GenerateTokenAsync(int userId) {
            var accessToken = await TokenHelper.GenerateTokenAsync(userId); 
            var refreshToken = await TokenHelper.GenerateRefreshToken();

          var userRecord = await dbContext.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(e => e.Id == userId);

            if (userRecord == null) {
                return null; 
            }




            var salt = PasswordHelper.GetSecureSalt(); 

            var refreshTokenHashed = PasswordHelper.HashUsingPbkdf2(refreshToken,salt); 

            
            if (userRecord.RefreshTokens != null && userRecord.RefreshTokens.Any())
            {
                await RemoveRefreshTokenAsync(userRecord);

            }
            
            userRecord.RefreshTokens?.Add(new RefreshToken{
                    ExpiryDate = DateTime.Now.AddDays(14), 
                    Ts = DateTime.Now, 
                    UserId=userId,
                    TokenHash=refreshTokenHashed, 
                    TokenSalt=Convert.ToBase64String(salt),
            });

            await dbContext.SaveChangesAsync();

            var token = new Tuple<string, string>(accessToken, refreshToken);

            return token;

        }

        public async Task<bool> RemoveRefreshTokenAsync(User user) {
            var userRecord = await dbContext.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(e => e.Id == user.Id);
            
            if(userRecord == null) {
                return false; 
            }

            if (userRecord.RefreshTokens != null && userRecord.RefreshTokens.Any())
            {
                var currentRefreshToken = userRecord.RefreshTokens.First();

                dbContext.RefreshTokens.Remove(currentRefreshToken);
            }

            return false;
        }        

        public async Task<ValidateTokenResponse> ValidateRefreshTokenAsync(RefreshTokenRequest refreshTokenRequest)
        { 
            var refreshToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(o => o.UserId == refreshTokenRequest.UserId);

            var response = new ValidateTokenResponse();

            
            if (refreshToken == null)
            {
                response.Success = false;
                response.Error = "Invalid session or user is already logged out";
                response.ErrorCode = "invalid_grant";
                return response;
            }


            var refreshTokenToValidateHash = PasswordHelper.HashUsingPbkdf2(refreshTokenRequest.RefreshToken, Convert.FromBase64String(refreshToken.TokenSalt));


            if (refreshToken.TokenHash != refreshTokenToValidateHash)
            {
                response.Success = false;
                response.Error = "Invalid refresh token";
                response.ErrorCode = "invalid_grant";
                return response;
            }
          
            if (refreshToken.ExpiryDate < DateTime.Now)
            {
                response.Success = false;
                response.Error = "Refresh token has expired";
                response.ErrorCode = "invalid_grant";
                return response;
            }

            response.Success = true;
            response.UserId = refreshToken.UserId;

            return response;
        }

    }
}
