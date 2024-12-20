using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;

using System.Security.Cryptography;

using System.Configuration;


namespace backend.Helpers {
  public class TokenHelper {
    private readonly IConfiguration configuration;

    public TokenHelper(IConfiguration _configuration) {
        configuration = _configuration; 
    } 

    public static async Task<String> GenerateAccessToken(int userId) {
        var tokenHanler = new JwtSecurityTokenHandler();
        var secretKey = configuration["Jwt"]; 
        var key = Convert.FromBase64String();
    }
  }
}
