namespace VehicleControlPanel.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public int RoleId { get; set; } // Foreign Key to Role table
        public Role Role { get; set; } 
        public int? SettingsId { get; set; } // Foreign Key to VehicleSettings table
        public VehicleSettings VehicleSettings { get; set; } 
    }
}
