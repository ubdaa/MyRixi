using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class TypeDuPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "AspNetUserTokens",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "AspNetRoles",
                newName: "Name");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Posts",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "Posts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "CommunityRoles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Communities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Channels",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Category",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "State",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Category");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AspNetUserTokens",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AspNetRoles",
                newName: "Description");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Posts",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
