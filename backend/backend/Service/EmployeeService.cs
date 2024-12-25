using backend.DbContext;
using backend.DTO;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class EmployeeService
    {
        private readonly AppDbcontext _context;

        public EmployeeService(AppDbcontext context)
        {
            _context = context;
        }

        // Create Employee with DTO
        public async Task<EmployeeDTO> CreateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = new Employee
            {
                name = employeeDto.Name,
                position = employeeDto.Position,
                age = employeeDto.Age,
                sex = employeeDto.Sex,
                phone_number = employeeDto.PhoneNumber,
                wage = employeeDto.Wage,
                Id = employeeDto.Id
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Return DTO
            return new EmployeeDTO
            {
                IdEmployee = employee.id_employee,
                Name = employee.name,
                Position = employee.position,
                Age = employee.age,
                Sex = employee.sex,
                PhoneNumber = employee.phone_number,
                Wage = employee.wage,
                Id = employeeDto.Id
            };
        }

        // Get Employee by ID with DTO
        public async Task<EmployeeDTO> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return null;

            return new EmployeeDTO
            {
                IdEmployee = employee.id_employee,
                Name = employee.name,
                Position = employee.position,
                Age = employee.age,
                Sex = employee.sex,
                PhoneNumber = employee.phone_number,
                Wage = employee.wage,
                Id = employee.Id
            };
        }

        // Get All Employees with DTOs
        public async Task<List<EmployeeDTO>> GetAllEmployeesAsync()
        {
            return await _context.Employees
                .Select(e => new EmployeeDTO
                {
                    IdEmployee = e.id_employee,
                    Name = e.name,
                    Position = e.position,
                    Age = e.age,
                    Sex = e.sex,
                    PhoneNumber = e.phone_number,
                    Wage = e.wage,
                   Id = e.Id
                }).ToListAsync();
        }

        // Update Employee with DTO
        public async Task<EmployeeDTO> UpdateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = await _context.Employees.FindAsync(employeeDto.IdEmployee);
            if (employee == null)
                return null;

            employee.name = employeeDto.Name;
            employee.position = employeeDto.Position;
            employee.age = employeeDto.Age;
            employee.sex = employeeDto.Sex;
            employee.phone_number = employeeDto.PhoneNumber;
            employee.wage = employeeDto.Wage;
            employee.Id = employeeDto.Id;

            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();

            return employeeDto;
        }

        // Delete Employee
        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get Employees by ClientId
        public async Task<List<EmployeeDTO>> GetEmployeesByClientIdAsync(int Id)
        {
            return await _context.Employees
                .Where(e => e.Id == Id)
                .Select(e => new EmployeeDTO
                {
                    IdEmployee = e.id_employee,
                    Name = e.name,
                    Position = e.position,
                    Age = e.age,
                    Sex = e.sex,
                    PhoneNumber = e.phone_number,
                    Wage = e.wage,
                    Id = e.Id
                }).ToListAsync();
        }
    }
}
