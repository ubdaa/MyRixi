using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class CorrectionDependanceCirculaireOwnerId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Communities_CommunityProfiles_OwnerId",
                table: "Communities");

            migrationBuilder.DropIndex(
                name: "IX_Communities_OwnerId",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Communities");

            migrationBuilder.AddColumn<bool>(
                name: "IsOwner",
                table: "CommunityProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOwner",
                table: "CommunityProfiles");

            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "Communities",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Communities_OwnerId",
                table: "Communities",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Communities_CommunityProfiles_OwnerId",
                table: "Communities",
                column: "OwnerId",
                principalTable: "CommunityProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
