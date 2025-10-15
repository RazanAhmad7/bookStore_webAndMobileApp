using Microsoft.AspNetCore.Mvc;

namespace SecondAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(IWebHostEnvironment environment, ILogger<FileUploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            try
            {
                _logger.LogInformation($"Upload request received. File: {file?.FileName}, Size: {file?.Length}");

                if (file == null || file.Length == 0)
                {
                    _logger.LogWarning("No file uploaded or file is empty");
                    return BadRequest("No file uploaded.");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only image files are allowed.");
                }

                // Validate file size (5MB limit)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size too large. Maximum size is 5MB.");
                }

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "books");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL
                var fileUrl = $"/uploads/books/{fileName}";

                _logger.LogInformation($"File uploaded successfully: {fileName}");

                return Ok(new
                {
                    url = fileUrl,
                    fileName = fileName,
                    originalName = file.FileName,
                    size = file.Length
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, "Internal server error occurred while uploading file.");
            }
        }

        [HttpDelete("delete/{fileName}")]
        public IActionResult DeleteFile(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", "books", fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation($"File deleted successfully: {fileName}");
                    return Ok(new { message = "File deleted successfully" });
                }

                return NotFound("File not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, "Internal server error occurred while deleting file.");
            }
        }
    }
}
