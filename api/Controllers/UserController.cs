using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VehicleControlPanel.DTOs;
using VehicleControlPanel.Models;
using System.Globalization;

namespace VehicleControlPanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == registerUserDto.Username || u.Email == registerUserDto.Email || u.PhoneNumber == registerUserDto.PhoneNumber))
                {
                    return BadRequest(new { status = 400, message = "User with this email, username, or phone number already exists." });
                }

                var vehicleSettings = new VehicleSettings
                {
                    HeadlightsId = 1,
                    Foglights = new List<int> { 0, 0 },
                    HeadlightAngle = 45
                };

                _context.VehicleSettings.Add(vehicleSettings);
                await _context.SaveChangesAsync();

                var user = new User
                {
                    FirstName = registerUserDto.FirstName,
                    LastName = registerUserDto.LastName,
                    Username = registerUserDto.Username,
                    Email = registerUserDto.Email,
                    PhoneNumber = registerUserDto.PhoneNumber,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
                    CreatedAt = DateTime.UtcNow,
                    RoleId = 2, 
                    SettingsId = vehicleSettings.Id
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "User registered successfully." });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { status = 500, message = "An error occurred while updating the database.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.Include(u => u.Role).Include(u => u.VehicleSettings).ThenInclude(vs => vs.Headlights).SingleOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                {
                    return Unauthorized(new { status = 401, message = "Invalid email or password." });
                }

                var token = GenerateJwtToken(user);

                var userDto = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Username = user.Username,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = user.CreatedAt.ToLocalTime().ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                    RoleId = user.RoleId,
                    RoleName = user.Role?.Name,
                    SettingsId = user.SettingsId,
                    VehicleSettings = user.VehicleSettings == null ? null : new VehicleSettingsDto
                    {
                        Id = user.VehicleSettings.Id,
                        HeadlightsId = user.VehicleSettings.HeadlightsId,
                        Headlights = user.VehicleSettings.Headlights == null ? null : new HeadlightsDto
                        {
                            Id = user.VehicleSettings.Headlights.Id,
                            Name = user.VehicleSettings.Headlights.Name
                        },
                        Foglights = user.VehicleSettings.Foglights,
                        HeadlightAngle = user.VehicleSettings.HeadlightAngle
                    }
                };

                return Ok(new { token, user = userDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("users")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.Include(u => u.Role).Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Username = u.Username,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    CreatedAt = u.CreatedAt.ToLocalTime().ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                    RoleId = u.RoleId,
                    RoleName = u.Role.Name
                }).ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpPost("addRole")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> AddRole([FromBody] RoleDto roleDto)
        {
            try
            {
                if (await _context.Roles.AnyAsync(r => r.Name == roleDto.Name))
                {
                    return BadRequest(new { status = 400, message = "Role with this name already exists." });
                }

                var role = new Role
                {
                    Name = roleDto.Name
                };

                _context.Roles.Add(role);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Role added successfully." });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { status = 500, message = "An error occurred while updating the database.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("isAuthenticated")]
        [Authorize]
        public async Task<IActionResult> IsAuthenticated()
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("Id")?.Value;
                if (userIdClaim == null)
                {
                    return Unauthorized(new { status = 401, message = "Unauthorized" });
                }

                var userId = int.Parse(userIdClaim);
                var user = await _context.Users.Include(u => u.VehicleSettings)
                                               .ThenInclude(vs => vs.Headlights)
                                               .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return Unauthorized(new { status = 401, message = "Unauthorized" });
                }

                if (user.SettingsId == null)
                {
                    var vehicleSettings = new VehicleSettings
                    {
                        HeadlightsId = 1,
                        Foglights = new List<int> { 0, 0 },
                        HeadlightAngle = 45
                    };

                    _context.VehicleSettings.Add(vehicleSettings);
                    await _context.SaveChangesAsync();

                    user.SettingsId = vehicleSettings.Id;
                    await _context.SaveChangesAsync();

                    var headlights = await _context.Headlights.FindAsync(vehicleSettings.HeadlightsId);
                    var foglightIds = vehicleSettings.Foglights;
                    var foglights = await _context.Foglights.Where(f => foglightIds.Contains(f.Id)).ToListAsync();

                    vehicleSettings.Headlights = headlights;

                    return Ok(new { status = 200, message = "User authenticated and settings initialized.", settings = vehicleSettings, foglights });
                }
                else
                {
                    var settings = await _context.VehicleSettings
                        .Include(vs => vs.Headlights)
                        .FirstOrDefaultAsync(vs => vs.Id == user.SettingsId);
                    var foglightIds = settings.Foglights;
                    var foglights = await _context.Foglights.Where(f => foglightIds.Contains(f.Id)).ToListAsync();

                    return Ok(new { status = 200, message = "User authenticated.", settings, foglights });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }
        [HttpPost("SaveNavigation")]
        [Authorize]
        public async Task<IActionResult> SaveNavigation([FromBody] LocationDataDto locationDataDto)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("Id")?.Value;
                if (userIdClaim == null)
                {
                    return Unauthorized(new { status = 401, message = "Unauthorized" });
                }

                var userId = int.Parse(userIdClaim);

                var locationData = new LocationData
                {
                    UserId = userId,
                    StartLatitude = locationDataDto.StartLatitude,
                    StartLongitude = locationDataDto.StartLongitude,
                    EndLatitude = locationDataDto.EndLatitude,
                    EndLongitude = locationDataDto.EndLongitude
                };

                _context.LocationData.Add(locationData);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Navigation data saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            try
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("Id", user.Id.ToString()),
                    new Claim("FirstName", user.FirstName),
                    new Claim("LastName", user.LastName),
                    new Claim("Username", user.Username),
                    new Claim("Email", user.Email),
                    new Claim("PhoneNumber", user.PhoneNumber),
                    new Claim("CreatedAt", user.CreatedAt.ToLocalTime().ToString("dd-MM-yyyy HH:mm:ss")),
                    new Claim("RoleId", user.RoleId.ToString()),
                    new Claim("RoleName", user.Role?.Name),
                    new Claim("SettingsId", user.SettingsId.ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddMonths(6),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while generating the JWT token.", ex);
            }
        }
    }
}
