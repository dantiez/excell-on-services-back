using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Auth")]
    public class AuthController : BaseApiController
    {
        private readonly AuthService authService;
        private readonly TokenService tokenService;

        public AuthController(AuthService _authService, TokenService _tokenService)
        {
            authService = _authService;
            tokenService = _tokenService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            if (
                loginRequest == null
                || string.IsNullOrEmpty(loginRequest.Email)
                || string.IsNullOrEmpty(loginRequest.Password)
            )
            {
                return BadRequest(
                    new TokenResponseDTO { Error = "Missing login details", ErrorCode = "L01" }
                );
            }

            var loginResponse = await authService.LoginAsync(loginRequest);

            if (!loginResponse.Success)
            {
                return Unauthorized(new { loginResponse.ErrorCode, loginResponse.Error });
            }

            return Ok(loginResponse);
        }

        [HttpPost]
        [Route("refresh_token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest refreshTokenRequest)
        {
            if (
                refreshTokenRequest == null
                || string.IsNullOrEmpty(refreshTokenRequest.RefreshToken)
                || refreshTokenRequest.UserId == 0
            )
            {
                return BadRequest(
                    new TokenResponseDTO
                    {
                        Error = "Missing refresh token details",
                        ErrorCode = "R01",
                    }
                );
            }

            var validateRefreshTokenResponse = await tokenService.ValidateRefreshTokenAsync(
                refreshTokenRequest
            );

            if (!validateRefreshTokenResponse.Success)
            {
                return BadRequest(validateRefreshTokenResponse);
            }

            var tokenResponse = await tokenService.GenerateTokenAsync(
                validateRefreshTokenResponse.UserId
            );

            return Ok(
                new TokenResponseDTO
                {
                    AccessToken = tokenResponse.Item1,
                    RefreshToken = tokenResponse.Item2,
                }
            );
        }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> Signup(SignUpRequest signupRequest)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(x => x.Errors.Select(c => c.ErrorMessage))
                    .ToList();
                if (errors.Any())
                {
                    return BadRequest(
                        new TokenResponseDTO
                        {
                            Error = $"{string.Join(",", errors)}",
                            ErrorCode = "S01",
                        }
                    );
                }
            }

            var signupResponse = await authService.SignupAsync(signupRequest);

            if (!signupResponse.Success)
            {
                return UnprocessableEntity(signupResponse);
            }

            return Ok(signupResponse.Email);
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout(int userId)
        {
            var logout = await authService.LogoutAsync(userId);

            if (!logout.Success)
            {
                return UnprocessableEntity(logout);
            }

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("info")]
        public async Task<IActionResult> Info()
        {
            var userResponse = await authService.GetInfoAsync(UserID);

            if (!userResponse.Success)
            {
                return UnprocessableEntity(userResponse);
            }

            return Ok(userResponse);
        }
    }
}
