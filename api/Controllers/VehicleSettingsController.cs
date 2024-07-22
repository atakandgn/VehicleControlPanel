using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleControlPanel.DTOs;

namespace VehicleControlPanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleSettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleSettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddHeadlights")]
        [AuthorizeRoles("1")]
        public async Task<IActionResult> AddHeadlights([FromBody] HeadlightsDto headlightsDto)
        {
            try
            {
                if (await _context.Headlights.AnyAsync(h => h.Name == headlightsDto.Name))
                {
                    return BadRequest(new { status = 400, message = "Headlights with this name already exists." });
                }

                var headlights = new Headlights
                {
                    Name = headlightsDto.Name
                };

                _context.Headlights.Add(headlights);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Headlights added successfully." });
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

        [HttpPut("UpdateHeadlights")]
        [AuthorizeRoles("1")]
        public async Task<IActionResult> UpdateHeadlights([FromBody] HeadlightsDto headlightsDto)
        {
            try
            {
                var headlights = await _context.Headlights.FindAsync(headlightsDto.Id);

                if (headlights == null)
                {
                    return NotFound(new { status = 404, message = "Headlights not found." });
                }

                if (await _context.Headlights.AnyAsync(h => h.Name == headlightsDto.Name && h.Id != headlightsDto.Id))
                {
                    return BadRequest(new { status = 400, message = "Another headlights with this name already exists." });
                }

                headlights.Name = headlightsDto.Name;

                _context.Headlights.Update(headlights);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Headlights updated successfully." });
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

        [HttpPost("AddFoglights")]
        [AuthorizeRoles("1")]
        public async Task<IActionResult> AddFoglights([FromBody] FoglightDto foglightDto)
        {
            try
            {
                if (await _context.Foglights.AnyAsync(f => f.Name == foglightDto.Name))
                {
                    return BadRequest(new { status = 400, message = "Foglight with this name already exists." });
                }

                var foglight = new Foglight
                {
                    Name = foglightDto.Name
                };

                _context.Foglights.Add(foglight);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Foglight added successfully." });
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

        [HttpPut("UpdateFoglights")]
        [AuthorizeRoles("1")]
        public async Task<IActionResult> UpdateFoglights([FromBody] FoglightDto foglightDto)
        {
            try
            {
                var foglight = await _context.Foglights.FindAsync(foglightDto.Id);

                if (foglight == null)
                {
                    return NotFound(new { status = 404, message = "Foglight not found." });
                }

                if (!string.IsNullOrEmpty(foglightDto.Name) &&
                    await _context.Foglights.AnyAsync(f => f.Name == foglightDto.Name && f.Id != foglightDto.Id))
                {
                    return BadRequest(new { status = 400, message = "Another foglight with this name already exists." });
                }

                if (!string.IsNullOrEmpty(foglightDto.Name))
                {
                    foglight.Name = foglightDto.Name;
                }

                _context.Foglights.Update(foglight);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Foglight updated successfully." });
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

        [HttpGet("GetHeadlightsData")]
        [Authorize]
        public async Task<IActionResult> GetHeadlightsData()
        {
            try
            {
                var headlights = await _context.Headlights.ToListAsync();
                return Ok(new { status = 200, data = headlights });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }
        [HttpGet("GetFoglightsData")]
        [Authorize]
        public async Task<IActionResult> GetFoglightsData()
        {
            try
            {
                var foglights = await _context.Foglights.ToListAsync();
                return Ok(new { status = 200, data = foglights });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }


        [HttpGet("GetSettingsTitles")]
        [Authorize]
        public async Task<IActionResult> GetSettingsTitles()
        {
            try
            {
                var settingsTitles = await _context.SettingsTitles.ToListAsync();
                return Ok(new { status = 200, data = settingsTitles });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("GetUserVehicleSettings")]
        [Authorize]
        public async Task<IActionResult> GetUserVehicleSettings()
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

                if (user == null || user.VehicleSettings == null)
                {
                    return NotFound(new { status = 404, message = "Vehicle settings not found." });
                }

                var settings = user.VehicleSettings;

                var frontFogStatus = settings.Foglights.Count > 0 ? settings.Foglights[0] : 0;
                var backFogStatus = settings.Foglights.Count > 1 ? settings.Foglights[1] : 0;

                var response = new
                {
                    status = 200,
                    message = "Vehicle settings retrieved successfully.",
                    settings = new
                    {
                        id = settings.Id,
                        headlightsId = settings.HeadlightsId,
                        headlights = new
                        {
                            id = settings.Headlights.Id,
                            name = settings.Headlights.Name
                        },
                        foglights = new
                        {
                            frontFog = frontFogStatus,
                            backFog = backFogStatus
                        },
                        headlightAngle = settings.HeadlightAngle
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }
        [HttpPut("UpdateVehicleSettings")]
        [Authorize]
        public async Task<IActionResult> UpdateVehicleSettings([FromBody] UpdateVehicleSettingsDto updateDto)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("Id")?.Value;
                if (userIdClaim == null)
                {
                    return Unauthorized(new { status = 401, message = "Unauthorized" });
                }

                var settingsIdClaim = HttpContext.User.FindFirst("SettingsId")?.Value;
                if (settingsIdClaim == null)
                {
                    return Unauthorized(new { status = 401, message = "Settings ID not found in token" });
                }

                var settingsId = int.Parse(settingsIdClaim);
                var vehicleSettings = await _context.VehicleSettings
                    .Include(vs => vs.Headlights)
                    .FirstOrDefaultAsync(vs => vs.Id == settingsId);

                if (vehicleSettings == null)
                {
                    return NotFound(new { status = 404, message = "Vehicle settings not found." });
                }

                vehicleSettings.HeadlightsId = updateDto.HeadlightsId ?? vehicleSettings.HeadlightsId;
                vehicleSettings.Foglights = updateDto.Foglights ?? vehicleSettings.Foglights;
                vehicleSettings.HeadlightAngle = updateDto.HeadlightAngle ?? vehicleSettings.HeadlightAngle;

                _context.VehicleSettings.Update(vehicleSettings);
                await _context.SaveChangesAsync();

                return Ok(new { status = 200, message = "Vehicle settings updated successfully.", settings = vehicleSettings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "An unexpected error occurred.", details = ex.Message });
            }
        }


    }

}
