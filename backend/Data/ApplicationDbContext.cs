using Microsoft.EntityFrameworkCore;
using JadwalPetani.Models;

namespace JadwalPetani.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options) {}
    public DbSet<User> Users { get; set; }
    public DbSet<PlantingSchedule> PlantingSchedules { get; set; }
    public DbSet<ScheduleTask> ScheduleTasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.GoogleId);
        });

        // Configure PlantingSchedule
        modelBuilder.Entity<PlantingSchedule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.PlantingSchedules)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure ScheduleTask
        modelBuilder.Entity<ScheduleTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.PlantingSchedule)
                .WithMany(ps => ps.Tasks)
                .HasForeignKey(e => e.PlantingScheduleId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
