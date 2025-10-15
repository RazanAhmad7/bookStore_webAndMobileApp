using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBooksImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageContentType",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "CoverImageData",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "CoverImageFileName",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "CoverImageUrl",
                table: "Books",
                newName: "CoverImagePath");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CoverImagePath",
                table: "Books",
                newName: "CoverImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "CoverImageContentType",
                table: "Books",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "CoverImageData",
                table: "Books",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverImageFileName",
                table: "Books",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }
    }
}
