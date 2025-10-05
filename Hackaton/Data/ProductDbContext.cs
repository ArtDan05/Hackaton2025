using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
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
        const Int32 BufferSize = 128;
        string dbpath;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            using (var fileStream = File.OpenRead("DatabasePath.txt"))
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, BufferSize))
            {
                dbpath = streamReader.ReadLine();
            }
            optionsBuilder.UseSqlite($"Data Source={dbpath}");
            
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
