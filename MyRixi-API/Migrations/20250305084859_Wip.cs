using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class Wip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_CommunityRoles_CommunityRoleId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_CommunityRoleId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CommunityRoleId",
                table: "Profiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CommunityRoleId",
                table: "Profiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_CommunityRoleId",
                table: "Profiles",
                column: "CommunityRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_CommunityRoles_CommunityRoleId",
                table: "Profiles",
                column: "CommunityRoleId",
                principalTable: "CommunityRoles",
                principalColumn: "Id");
        }
    }
}
