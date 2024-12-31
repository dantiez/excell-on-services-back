using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace backend.Helpers {

    public class TokenHelper {
        public const string Issuer = "http://localhost:3000"; 
        public const string Audience = "http://localhost:7860";
        public const string Secret = "539e3aa0f2e98a11c33710a83efef95469f769f1d2e8b1652ae8cefb3e91d7801e83e5863c69161c6f0b1cb19cf6fc33a3772eed2fc210dfc725081ea1af7ce66119e8c09c902dbea1800ccaa7dba38fe03638011877082f52be37625f8bffb153de64bcd360667756f8909b480ab296a045403227c9c72afb96f8ad8e299266f54c81c29790a6b288be17cd2af047833b760f9605633c68876b08ea176f3be8821ee97b7b10535c6284a469204e6c2d5dc315907fb58185967f33e234192a8c8091b909aad61a84754b56b68b2236c4fbc80ce2bf5f8ab4faa403ac8691f2f69db4a677062f6c876e5322d9a912e2e5e9c441eca103e3fb7ee9107ea5688984";
        private readonly IConfiguration _config;
        public TokenHelper(IConfiguration configuration) {
            this._config = configuration; 
        }

        public static async Task<string> GenerateTokenAsync(int userId) {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Convert.FromBase64String(Secret);
            var claimsIdentity = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                    });

            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature); 
            var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = claimsIdentity, 
                    Issuer = Issuer, 
                    Audience = Audience, 
                    Expires = DateTime.Now.AddMinutes(15),
                    SigningCredentials = signingCredentials,
                    NotBefore = DateTime.Now,
                    }; 

            var securityToken = tokenHandler.CreateToken(tokenDescriptor); 
            
            return await System.Threading.Tasks.Task.Run(()=> tokenHandler.WriteToken(securityToken));
        }

        public static async Task<string> GenerateRefreshToken () {
            var sercureRandomBytes = new byte[32];

            using var randomNumberGenerator = RandomNumberGenerator.Create(); 

            await System.Threading.Tasks.Task.Run(() => randomNumberGenerator.GetBytes(sercureRandomBytes)); 

            var refreshToken = Convert.ToBase64String(sercureRandomBytes); 
           
            return refreshToken;
        }
    } 
}
