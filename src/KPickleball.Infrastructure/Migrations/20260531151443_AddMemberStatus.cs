using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KPickleball.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMemberStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemberStatus",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MemberStatus",
                table: "Users");
        }
    }
}
