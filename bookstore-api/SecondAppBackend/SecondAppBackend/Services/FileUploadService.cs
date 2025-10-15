using Microsoft.AspNetCore.Http;

namespace SecondAppBackend.Services
{
    /// <summary>
    /// Service for handling file uploads, specifically book cover images
    /// </summary>
    public class FileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadPath;

        public FileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "book-covers");

            // Ensure upload directory exists
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        /// <summary>
        /// Upload a book cover image and return file information
        /// </summary>
        /// <param name="file">The uploaded file</param>
        /// <param name="bookId">The book ID for unique naming</param>
        /// <returns>File information including path and metadata</returns>
        public async Task<FileUploadResult> UploadBookCoverAsync(IFormFile file, int bookId)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file provided");
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                throw new ArgumentException("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.");
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                throw new ArgumentException("File size too large. Maximum size is 5MB.");
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"book_{bookId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(_uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return new FileUploadResult
            {
                FileName = fileName,
                FilePath = filePath,
                ContentType = file.ContentType,
                Size = file.Length,
                Url = $"/uploads/book-covers/{fileName}"
            };
        }

        /// <summary>
        /// Delete a book cover image
        /// </summary>
        /// <param name="fileName">The filename to delete</param>
        public void DeleteBookCover(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return;

            var filePath = Path.Combine(_uploadPath, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        /// <summary>
        /// Get file as byte array for database storage
        /// </summary>
        /// <param name="file">The uploaded file</param>
        /// <returns>File data as byte array</returns>
        public async Task<byte[]> GetFileBytesAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
    }

    /// <summary>
    /// Result object for file upload operations
    /// </summary>
    public class FileUploadResult
    {
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long Size { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
