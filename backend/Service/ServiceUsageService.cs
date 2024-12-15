using backend.DbContext;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Service
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
                .ToList();
        }

        public List<ServiceUsage> GetServiceUsagesByStatus(string status)
        {
            return _context.ServiceUsages
                .Include(su => su.Employee)
                .Where(su => su.status == status)
                .ToList();
        }

        public ServiceUsage GetServiceUsageById(int id)
        {
            return _context.ServiceUsages
                .Include(su => su.Employee)
                .FirstOrDefault(su => su.id_service_usage == id);
        }

        public void CreateServiceUsage(int idEmployee, int idService, decimal servicePrice, string status)
        {
            if (servicePrice <= 0)
            {
                throw new ArgumentException("Service price must be greater than 0.");
            }

            var serviceUsage = new ServiceUsage
            {
                id_employee = idEmployee,
                id_service = idService,
                total_fee = servicePrice, // total_fee chỉ bằng servicePrice
                status = status,
                usage_date = DateTime.Now,
                transaction_date = null // Defaulting transaction_date to null
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



        public List<ServiceUsage> GetServiceUsagesByClient(int idClient, string status, DateTime? transactionDate)
        {
            var query = _context.ServiceUsages.Include(su => su.Employee).Include(su => su.Service).AsQueryable();

            if (idClient > 0)
                query = query.Where(su => su.Employee.id_employee == idClient);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(su => su.status == status);

            if (transactionDate.HasValue)
                query = query.Where(su => su.transaction_date.HasValue && su.transaction_date.Value.Date == transactionDate.Value.Date);

            return query.ToList();
        }



        public void UpdateTransactionDate(int idServiceUsage, DateTime newTransactionDate)
        {
            var serviceUsage = _context.ServiceUsages.FirstOrDefault(su => su.id_service_usage == idServiceUsage);
            if (serviceUsage == null)
                throw new ArgumentException("ServiceUsage not found.");

            serviceUsage.transaction_date = newTransactionDate;
            _context.ServiceUsages.Update(serviceUsage);
            _context.SaveChanges();
        }
    }
}
