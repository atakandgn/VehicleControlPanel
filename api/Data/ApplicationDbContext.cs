using Microsoft.EntityFrameworkCore;
using VehicleControlPanel.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<VehicleSettings> VehicleSettings { get; set; }
    public DbSet<Headlights> Headlights { get; set; }
    public DbSet<Foglight> Foglights { get; set; }
    public DbSet<Role> Roles { get; set; }

    public DbSet<SettingsTitles> SettingsTitles { get; set; }
    public DbSet<LocationData> LocationData { get; set; }  

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // The relationship between User and VehicleSettings
        modelBuilder.Entity<User>()
            .HasOne(u => u.VehicleSettings)
            .WithMany()
            .HasForeignKey(u => u.SettingsId)
            .OnDelete(DeleteBehavior.SetNull);

        // The relationship between User and Role
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany()
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VehicleSettings>()
            .Property(vs => vs.Foglights)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
            );

        // Seed SettingsTitles data
        modelBuilder.Entity<SettingsTitles>().HasData(
            new SettingsTitles { Id = 1, Title = "Car" },
            new SettingsTitles { Id = 2, Title = "Driving" },
            new SettingsTitles { Id = 3, Title = "Seating" },
            new SettingsTitles { Id = 4, Title = "Air" },
            new SettingsTitles { Id = 5, Title = "Lights" },
            new SettingsTitles { Id = 6, Title = "Display" },
            new SettingsTitles { Id = 7, Title = "Services" },
            new SettingsTitles { Id = 8, Title = "Software" }
        );

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Default User" }
        );
          modelBuilder.Entity<Headlights>().HasData(
            new Role { Id = 1, Name = "Off" },
            new Role { Id = 2, Name = "Parking" },
            new Role { Id = 3, Name = "On" },
            new Role { Id = 4, Name = "Auto" }
        );

        modelBuilder.Entity<Foglight>().HasData(
            new Role { Id = 1, Name = "Front Fog" },
            new Role { Id = 2, Name = "Back Fog" }
        );
    }
}
