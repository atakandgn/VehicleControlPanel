namespace VehicleControlPanel.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string CreatedAt { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? SettingsId { get; set; }
        public VehicleSettingsDto VehicleSettings { get; set; }
    }
    public class VehicleSettingsDto
    {
        public int Id { get; set; }
        public int HeadlightsId { get; set; }
        public HeadlightsDto Headlights { get; set; }
        public List<int> Foglights { get; set; }
        public int HeadlightAngle { get; set; }
    }

    public class RegisterUserDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Password { get; set; }
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
