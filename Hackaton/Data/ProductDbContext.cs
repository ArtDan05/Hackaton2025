using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hackaton.Data
{
    public class ProductDbContext : DbContext
    {
        public DbSet<Users> Users { get; set; }
        public DbSet<Secrets> Secrets { get; set; }
        public DbSet<Requests> Requests { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=../Database/secrets.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>()
                .HasKey(u => u.UserID);

            modelBuilder.Entity<Secrets>()
                .HasKey(s => s.ID);

            modelBuilder.Entity<Requests>()
                .HasKey(r => r.ID);

            base.OnModelCreating(modelBuilder);
        }
    }
}
