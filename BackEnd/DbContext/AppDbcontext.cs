namespace BackEnd.DbContext
{
    using BackEnd.Model;
    using Microsoft.EntityFrameworkCore;
    using System;

    public class AppDbcontext : DbContext
    {
        public AppDbcontext(DbContextOptions<AppDbcontext> options) : base(options) { }

        public DbSet<ServiceUsage> ServiceUsages { get; set; }
        
        public DbSet<TransactionDetail> TransactionDetail { get; set; }

        public DbSet<Transaction> Transaction { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasKey(t => t.IdTransaction);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Client)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.IdClient);

             modelBuilder.Entity<Transaction>()
                .Property(t => t.StartDate)
                .IsRequired();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.EndDate)
                .IsRequired();

            modelBuilder.Entity<TransactionDetail>()
              .HasKey(td => new { td.IdTransaction, td.IdServiceUsage });  // Khoá chính phức hợp

            modelBuilder.Entity<TransactionDetail>()
                .HasOne(td => td.Transaction)
                .WithMany(t => t.TransactionDetails)
                .HasForeignKey(td => td.IdTransaction);

            modelBuilder.Entity<TransactionDetail>()
                .HasOne(td => td.ServiceUsage)
                .WithMany()
                .HasForeignKey(td => td.IdServiceUsage);

        }
    }
}
