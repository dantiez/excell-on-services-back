using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/User")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<UserDTO>> GetAllUsers()
        {
            return Ok(_userService.GetAllUsers());
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public ActionResult<UserDTO> GetUserById(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserDTO userDto)
        {
            _userService.CreateUser(userDto);
            return CreatedAtAction(nameof(GetUserById), new { id = userDto.Id }, userDto);
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UpdateUser userDto)
        {
            if (!_userService.UpdateUser(id, userDto)) return NotFound();

            return Ok(id);
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            if (!_userService.DeleteUser(id)) return NotFound();

            return Ok(id);
        }
    }
}
