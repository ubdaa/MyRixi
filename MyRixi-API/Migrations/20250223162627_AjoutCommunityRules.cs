using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class AjoutCommunityRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rules",
                table: "Communities");

            migrationBuilder.CreateTable(
                name: "CommunityRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CommunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommunityRules_Communities_CommunityId",
                        column: x => x.CommunityId,
                        principalTable: "Communities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommunityRules_CommunityId",
                table: "CommunityRules",
                column: "CommunityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommunityRules");

            migrationBuilder.AddColumn<string>(
                name: "Rules",
                table: "Communities",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
