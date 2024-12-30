namespace backend.DbContext
{
    using backend.Model;
    using Microsoft.EntityFrameworkCore;

    public partial class AppDbcontext : DbContext
    {
        public AppDbcontext () {

        }
        public AppDbcontext(DbContextOptions<AppDbcontext> options) : base(options) { }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.LogTo(Console.WriteLine); 
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Services> Services { get; set; }
        public DbSet<ServiceUsage> ServiceUsages { get; set; }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<RefreshToken> RefreshTokens {get;set;}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<User>()
                .HasKey(c => c.Id);

            modelBuilder.Entity<User>()
                .HasMany(c => c.Transactions)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.Id);

            modelBuilder.Entity<User>()
                .HasMany(c => c.Employees)  
                .WithOne(e => e.User)
                .HasForeignKey(e => e.Id);

            modelBuilder.Entity<Employee>()
                .HasKey(e => e.id_employee);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithMany(c => c.Employees) 
                .HasForeignKey(e => e.Id);

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
    .HasOne(su => su.User)
    .WithMany(c => c.ServiceUsages) 
    .HasForeignKey(su => su.Id)
    .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Transaction>()
                .HasKey(t => t.id_transaction);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
