using backend.DbContext;
using backend.DTO;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class ServicesService
    {
        private readonly AppDbcontext _context;

        public ServicesService(AppDbcontext context)
        {
            _context = context;
        }

        // Create Service
        public async Task<ServiceDTO> CreateServiceAsync(ServiceDTO serviceDto)
        {
            var service = new Services
            {
                name_service = serviceDto.NameService,
                content = serviceDto.Content,
                price = serviceDto.Price
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            // Map back to DTO for return
            return new ServiceDTO
            {
                IdService = service.id_services,
                NameService = service.name_service,
                Content = service.content,
                Price = service.price
            };
        }

        // Read Service by ID
        public async Task<ServiceDTO> GetServiceByIdAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return null;

            return new ServiceDTO
            {
                IdService = service.id_services,
                NameService = service.name_service,
                Content = service.content,
                Price = service.price
            };
        }

        // Read All Services
        public async Task<List<ServiceDTO>> GetAllServicesAsync()
        {
            var services = await _context.Services.ToListAsync();
            return services.Select(service => new ServiceDTO
            {
                IdService = service.id_services,
                NameService = service.name_service,
                Content = service.content,
                Price = service.price
            }).ToList();
        }

        // Update Service
        public async Task<ServiceDTO> UpdateServiceAsync(ServiceDTO serviceDto)
        {
            var existingService = await _context.Services.FindAsync(serviceDto.IdService);
            if (existingService == null) return null;

            // Update fields
            existingService.name_service = serviceDto.NameService;
            existingService.content = serviceDto.Content;
            existingService.price = serviceDto.Price;

            _context.Services.Update(existingService);
            await _context.SaveChangesAsync();

            return new ServiceDTO
            {
                IdService = existingService.id_services,
                NameService = existingService.name_service,
                Content = existingService.content,
                Price = existingService.price
            };
        }

        // Delete Service
        public async Task<string> DeleteServiceAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Invalid service ID.", nameof(id));
            }

            // Check if the service is in use
            bool isServiceInUse = await _context.ServiceUsages.AnyAsync(su => su.id_service == id && su.status != "completed");
            if (isServiceInUse)
            {
                return "Cannot delete the service because it is currently in use.";
            }

            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return "Service not found.";
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return "Service deleted successfully.";
        }
    }
}
