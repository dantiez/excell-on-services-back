#nullable disable
using System.Text.Json.Serialization;

namespace backend.DTO
{
    public class TokenResponseDTO : BaseResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int UserId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string FirstName { get; set; }
        public bool isAdmin { get; set; }
    }

    public class RefreshTokenRequest
    {
        public int UserId { get; set; }
        public string RefreshToken { get; set; }
    }

    public class ValidateTokenResponse : BaseResponse
    {
        public int UserId { get; set; }
    }
}
