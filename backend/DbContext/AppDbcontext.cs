
namespace backend.DbContext
{
    using backend.Model;
    using Microsoft.EntityFrameworkCore;

    public class AppDbcontext : DbContext
    {
        public AppDbcontext(DbContextOptions<AppDbcontext> options) : base(options) { }

        public DbSet<Client> Client { get; set; }
       
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<ServiceUsage> ServiceUsages { get; set; }
        public DbSet<Transaction> Transaction { get; set; }
       

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Client configuration
            modelBuilder.Entity<Client>()
                .HasKey(c => c.id_Client);


            modelBuilder.Entity<Client>()
                .HasMany(c => c.Transactions)
                .WithOne(t => t.Client)
                .HasForeignKey(t => t.id_client);


            // Employee configuration
            modelBuilder.Entity<Employee>()
                .HasKey(e => e.id_employee);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.ServiceUsages)
                .WithOne(su => su.Employee)
                .HasForeignKey(su => su.id_service_usage);

            // Service configuration
            modelBuilder.Entity<Service>()
                .HasKey(s => s.id_services);

            modelBuilder.Entity<Service>()
                .HasMany(s => s.ServiceUsages)
                .WithOne(su => su.Service)
                .HasForeignKey(su => su.id_service);

            // ServiceUsage configuration
            modelBuilder.Entity<ServiceUsage>()
                .HasKey(su => su.id_service_usage);

            modelBuilder.Entity<ServiceUsage>()
                .HasOne(su => su.Employee)
                .WithMany(e => e.ServiceUsages)
                .HasForeignKey(su => su.id_employee);



            modelBuilder.Entity<ServiceUsage>()
                .HasOne(su => su.Service)
                .WithMany(s => s.ServiceUsages)
                .HasForeignKey(su => su.id_service);

            // Transaction configuration
            modelBuilder.Entity<Transaction>()
                .HasKey(t => t.id_transaction);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Client)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.id_client);



      

            base.OnModelCreating(modelBuilder);
        }
    }
}