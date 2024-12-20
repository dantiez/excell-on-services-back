namespace backend.DbContext
{
    using backend.Model;
    using Microsoft.EntityFrameworkCore;

    public class AppDbcontext : DbContext
    {
        public AppDbcontext(DbContextOptions<AppDbcontext> options) : base(options) { }

        public DbSet<Client> Client { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Services> Services { get; set; }
        public DbSet<ServiceUsage> ServiceUsages { get; set; }
        public DbSet<Transaction> Transaction { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<Client>()
                .HasKey(c => c.id_Client);

            modelBuilder.Entity<Client>()
                .HasMany(c => c.Transactions)
                .WithOne(t => t.Client)
                .HasForeignKey(t => t.id_client);

            modelBuilder.Entity<Client>()
                .HasMany(c => c.Employees)  
                .WithOne(e => e.Client)
                .HasForeignKey(e => e.id_client);

            modelBuilder.Entity<Employee>()
                .HasKey(e => e.id_employee);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Client)
                .WithMany(c => c.Employees) 
                .HasForeignKey(e => e.id_client);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.ServiceUsages)  
                .WithOne(su => su.Employee)  
                .HasForeignKey(su => su.id_employee)
                .OnDelete(DeleteBehavior.SetNull); 

            
            modelBuilder.Entity<Services>()
                .HasKey(s => s.id_services);

            modelBuilder.Entity<Services>()
                .HasMany(s => s.ServiceUsages)  
                .WithOne(su => su.Service) 
                .HasForeignKey(su => su.id_service)
                .OnDelete(DeleteBehavior.SetNull);  

           
            modelBuilder.Entity<ServiceUsage>()
                .HasKey(su => su.id_service_usage);
          
            modelBuilder.Entity<ServiceUsage>()
    .HasOne(su => su.Client)
    .WithMany(c => c.ServiceUsages) 
    .HasForeignKey(su => su.id_client)
    .OnDelete(DeleteBehavior.Restrict);


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
