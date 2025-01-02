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
private readonly EmployeeService _employeeService;
        public UserController(UserService userService, EmployeeService employeeService)
        {
            _userService = userService;
            _employeeService = employeeService;
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

        [HttpPut("currentUser/{id}")]
        public SignUpResponse  UpdateCurrentUser(int id, [FromBody] UpdateCurrentUser userDto)
        {
            
            return _userService.UpdateCurrentUser(id, userDto);
        }


        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public DeleteResponse DeleteUser(int id)
        {
            var employees = _employeeService.GetEmployeesByClientIdAsync(id); 
               if(employees != null) return new DeleteResponse {
                   Success = false,
                           Error = "Cannot delete User that have employees"
               };
            if (!_userService.DeleteUser(id)) return new DeleteResponse {
                Success = false, 
                        Error = "Cannot delete User"
            };



            return new DeleteResponse {
                Success = true
            };
        }
    }
}
