using Microsoft.AspNetCore.Cryptography.KeyDerivation; 

using System.Security.Cryptography; 

namespace backend.Helpers
{
    public class PasswordHelper {
        public static byte[] GetSalt() {
            return RandomNumberGenerator.GetBytes(32);
        }

        public static string HashPassword(string password, byte[] salt) {

            byte[] deriveKey = KeyDerivation.Pbkdf2(password,salt,KeyDerivationPrf.HMACSHA256, iterationCount: 300000, 32); 

            return Convert.ToBase64String(deriveKey);
        }
    } 
}
