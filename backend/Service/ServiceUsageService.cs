using backend.DTO;
using backend.Model;
using backend.DbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class ServiceUsageService
    {
        private readonly AppDbcontext _context;

        public ServiceUsageService(AppDbcontext context)
        {
            _context = context;
        }

        // Create ServiceUsage
        public async Task<ServiceUsageDTO> CreateServiceUsageAsync(ServiceUsageDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "ServiceUsageDTO cannot be null");

            var serviceUsage = new ServiceUsage
            {
                id_employee = dto.IdEmployee,
                id_service = dto.IdService,
                id_client = dto.IdClient,
                status = dto.Status,
                total_fee = dto.TotalFee,
                usage_date = dto.UsageDate,
                transaction_date = dto.TransactionDate
            };

            await _context.ServiceUsages.AddAsync(serviceUsage);
            await _context.SaveChangesAsync();

            return new ServiceUsageDTO
            {
                IdServiceUsage = serviceUsage.id_service_usage,
                IdEmployee = serviceUsage.id_employee,
                IdService = serviceUsage.id_service,
                IdClient = serviceUsage.id_client,
                Status = serviceUsage.status,
                TotalFee = serviceUsage.total_fee,
                UsageDate = serviceUsage.usage_date,
                TransactionDate = serviceUsage.transaction_date
            };
        }

        // Get ServiceUsage by ID
        public async Task<ServiceUsageDTO> GetServiceUsageByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid ID");

            var serviceUsage = await _context.ServiceUsages
                .Include(su => su.Employee)
                .Include(su => su.Client)
                .Include(su => su.Service)
                .FirstOrDefaultAsync(su => su.id_service_usage == id);

            if (serviceUsage == null)
                return null;

            return new ServiceUsageDTO
            {
                IdServiceUsage = serviceUsage.id_service_usage,
                IdEmployee = serviceUsage.id_employee,
                IdService = serviceUsage.id_service,
                IdClient = serviceUsage.id_client,
                Status = serviceUsage.status,
                TotalFee = serviceUsage.total_fee,
                UsageDate = serviceUsage.usage_date,
                TransactionDate = serviceUsage.transaction_date
            };
        }

        // Update ServiceUsage
        public async Task<ServiceUsageDTO> UpdateServiceUsageAsync(ServiceUsageDTO dto)
        {
            if (dto == null || dto.IdServiceUsage <= 0)
                throw new ArgumentException("Invalid ServiceUsageDTO");

            var serviceUsage = await _context.ServiceUsages.FindAsync(dto.IdServiceUsage);

            if (serviceUsage == null)
                return null;

            serviceUsage.status = dto.Status;
            serviceUsage.transaction_date = dto.TransactionDate;

            _context.ServiceUsages.Update(serviceUsage);
            await _context.SaveChangesAsync();

            return new ServiceUsageDTO
            {
                IdServiceUsage = serviceUsage.id_service_usage,
                IdEmployee = serviceUsage.id_employee,
                IdService = serviceUsage.id_service,
                IdClient = serviceUsage.id_client,
                Status = serviceUsage.status,
                TotalFee = serviceUsage.total_fee,
                UsageDate = serviceUsage.usage_date,
                TransactionDate = serviceUsage.transaction_date
            };
        }

        // Get All ServiceUsages
        public async Task<List<ServiceUsageDTO>> GetAllServiceUsagesAsync()
        {
            return await _context.ServiceUsages
                .Include(su => su.Employee)
                .Include(su => su.Client)
                .Include(su => su.Service)
                .Select(su => new ServiceUsageDTO
                {
                    IdServiceUsage = su.id_service_usage,
                    IdEmployee = su.id_employee,
                    IdService = su.id_service,
                    IdClient = su.id_client,
                    Status = su.status,
                    TotalFee = su.total_fee,
                    UsageDate = su.usage_date,
                    TransactionDate = su.transaction_date
                }).ToListAsync();
        }

        public async Task<bool> CheckIfEmployeeHasPaidServiceAsync(int idEmployee)
        {
            try
            {
               
                var paidService = await _context.ServiceUsages
                    .Where(su => su.id_employee == idEmployee && su.status == "paid")
                    .FirstOrDefaultAsync();

                return paidService != null;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error checking employee service payment:", ex);
                return false;
            }
        }

        public async Task<List<ServiceUsageDTO>> GetServiceUsagesByClientStatusAndDateAsync(int idClient, string status, DateTime? transactionDate)
        {
            var query = _context.ServiceUsages.AsQueryable();

      
            query = query.Where(su => su.id_client == idClient);

      
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(su => su.status == status);
            }

      
            if (transactionDate.HasValue)
            {
                query = query.Where(su => su.transaction_date == transactionDate);
            }
            else
            {
                query = query.Where(su => su.transaction_date == null);
            }

            return await query
                .Include(su => su.Employee)
                .Include(su => su.Client)
                .Include(su => su.Service)
                .Select(su => new ServiceUsageDTO
                {
                    IdServiceUsage = su.id_service_usage,
                    IdEmployee = su.id_employee,
                    IdService = su.id_service,
                    IdClient = su.id_client,
                    Status = su.status,
                    TotalFee = su.total_fee,
                    UsageDate = su.usage_date,
                    TransactionDate = su.transaction_date
                })
                .ToListAsync();
        }
        public async Task<List<ServiceDTO>> GetServicesByEmployeeAsync(int idEmployee)
        {
            if (idEmployee <= 0)
                throw new ArgumentException("Invalid employee ID");

            var services = await _context.ServiceUsages
                .Where(su => su.id_employee == idEmployee)
                .Include(su => su.Service) 
                .Select(su => new ServiceDTO
                {
                    IdService = su.Service.id_services,
                    NameService = su.Service.name_service,
                    Content = su.Service.content,
                    Price = su.Service.price
                })
                .ToListAsync();

            return services;
        }
        public async Task<List<ServiceUsageDTO>> GetServiceUsagesByStatusAsync(string status)
        {
            if (string.IsNullOrEmpty(status))
                throw new ArgumentException("Status cannot be null or empty.");

            var query = _context.ServiceUsages.AsQueryable();

            query = query.Where(su => su.status == status);

            var serviceUsages = await query
                .Include(su => su.Employee)
                .Include(su => su.Client)
                .Include(su => su.Service)
                .Select(su => new ServiceUsageDTO
                {
                    IdServiceUsage = su.id_service_usage,
                    IdEmployee = su.id_employee,
                    IdService = su.id_service,
                    IdClient = su.id_client,
                    Status = su.status,
                    TotalFee = su.total_fee,
                    UsageDate = su.usage_date,
                    TransactionDate = su.transaction_date
                })
                .ToListAsync();

            return serviceUsages;
        }
        public async Task<ServiceUsageDTO> UpdateServiceAsync(int idServiceUsage, int newIdService)
        {
            if (idServiceUsage <= 0 || newIdService <= 0)
                throw new ArgumentException("Invalid parameters.");

            var serviceUsage = await _context.ServiceUsages.FindAsync(idServiceUsage);

            if (serviceUsage == null)
                return null;

            serviceUsage.id_service = newIdService; // Update service ID

            _context.ServiceUsages.Update(serviceUsage);
            await _context.SaveChangesAsync();

            return new ServiceUsageDTO
            {
                IdServiceUsage = serviceUsage.id_service_usage,
                IdEmployee = serviceUsage.id_employee,
                IdService = serviceUsage.id_service,
                IdClient = serviceUsage.id_client,
                Status = serviceUsage.status,
                TotalFee = serviceUsage.total_fee,
                UsageDate = serviceUsage.usage_date,
                TransactionDate = serviceUsage.transaction_date
            };
        }
        public async Task<ServiceUsageDTO> UpdateTransactionDateAsync(int idServiceUsage, DateTime newTransactionDate)
        {
            if (idServiceUsage <= 0)
                throw new ArgumentException("Invalid ServiceUsage ID");

            var serviceUsage = await _context.ServiceUsages.FindAsync(idServiceUsage);

            if (serviceUsage == null)
                return null;

            serviceUsage.transaction_date = newTransactionDate; // Update transaction date

            _context.ServiceUsages.Update(serviceUsage);
            await _context.SaveChangesAsync();

            return new ServiceUsageDTO
            {
                IdServiceUsage = serviceUsage.id_service_usage,
                IdEmployee = serviceUsage.id_employee,
                IdService = serviceUsage.id_service,
                IdClient = serviceUsage.id_client,
                Status = serviceUsage.status,
                TotalFee = serviceUsage.total_fee,
                UsageDate = serviceUsage.usage_date,
                TransactionDate = serviceUsage.transaction_date
            };
        }


    }
}
