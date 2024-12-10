using BackEnd.DbContext;
using BackEnd.Model;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Service
{
    public class ServiceUsageService
    {
        private readonly AppDbcontext _context;

        public ServiceUsageService(AppDbcontext context)
        {
            _context = context;
        }


        public List<ServiceUsage> GetAllServiceUsages()
        {
            return _context.ServiceUsages
                .Include(su => su.Employee)
                .Include(su => su.Department)
                .ToList();
        }

    
        public ServiceUsage GetServiceUsageById(int id)
        {
            return _context.ServiceUsages
                .Include(su => su.Employee)
                .Include(su => su.Department)
                .FirstOrDefault(su => su.IdServiceUsage == id);
        }



        public void CreateServiceUsage(int idEmployee, int idService, int number, decimal servicePrice)
        {
            if (number <= 0 || servicePrice <= 0)
            {
                throw new ArgumentException("Số lần và giá dịch vụ phải lớn hơn 0.");
            }

            // Tính tổng số tiền
            decimal totalFee = number * servicePrice;

            // Tạo bản ghi mới
            var serviceUsage = new ServiceUsage
            {
                IdEmployee = idEmployee,
                IdService = idService,
                Number = number,
                total_fee = totalFee,
                UsageDate = DateTime.Now
            };

            _context.ServiceUsages.Add(serviceUsage);
            _context.SaveChanges();
        }


        public void UpdateServiceUsage(ServiceUsage serviceUsage)
        {
            if (serviceUsage == null)
                throw new ArgumentNullException(nameof(serviceUsage));

            _context.ServiceUsages.Update(serviceUsage);
            _context.SaveChanges();
        }

  
        public void DeleteServiceUsage(int id)
        {
            var serviceUsage = _context.ServiceUsages.FirstOrDefault(su => su.IdServiceUsage == id);
            if (serviceUsage == null)
                throw new ArgumentException("ServiceUsage not found.");

            _context.ServiceUsages.Remove(serviceUsage);
            _context.SaveChanges();
        }
        public decimal GetTotalFeeByEmployee(int employeeId)
        {
            return _context.ServiceUsages
                .Where(su => su.IdEmployee == employeeId)
                .Sum(su => su.total_fee);
        }
    }
}

