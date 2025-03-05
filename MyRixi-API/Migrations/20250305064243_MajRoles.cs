using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class MajRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_CommunityRoles_RoleId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CanBanMembers",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanCreateEvents",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanEditCommunitySettings",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanKickMembers",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanManageChannels",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanManageRoles",
                table: "CommunityRoles");

            migrationBuilder.DropColumn(
                name: "CanModerateChat",
                table: "CommunityRoles");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "Profiles",
                newName: "CommunityRoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Profiles_RoleId",
                table: "Profiles",
                newName: "IX_Profiles_CommunityRoleId");

            migrationBuilder.RenameColumn(
                name: "IsAdministrator",
                table: "CommunityRoles",
                newName: "IsProtected");

            migrationBuilder.RenameColumn(
                name: "CanPinMessages",
                table: "CommunityRoles",
                newName: "IsDefault");

            migrationBuilder.CreateTable(
                name: "CommunityProfileRoles",
                columns: table => new
                {
                    CommunityProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    CommunityRoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityProfileRoles", x => new { x.CommunityProfileId, x.CommunityRoleId });
                    table.ForeignKey(
                        name: "FK_CommunityProfileRoles_CommunityRoles_CommunityRoleId",
                        column: x => x.CommunityRoleId,
                        principalTable: "CommunityRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommunityProfileRoles_Profiles_CommunityProfileId",
                        column: x => x.CommunityProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_CommunityRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "CommunityRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfileRoles_CommunityRoleId",
                table: "CommunityProfileRoles",
                column: "CommunityRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_CommunityRoles_CommunityRoleId",
                table: "Profiles",
                column: "CommunityRoleId",
                principalTable: "CommunityRoles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_CommunityRoles_CommunityRoleId",
                table: "Profiles");

            migrationBuilder.DropTable(
                name: "CommunityProfileRoles");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.RenameColumn(
                name: "CommunityRoleId",
                table: "Profiles",
                newName: "RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Profiles_CommunityRoleId",
                table: "Profiles",
                newName: "IX_Profiles_RoleId");

            migrationBuilder.RenameColumn(
                name: "IsProtected",
                table: "CommunityRoles",
                newName: "IsAdministrator");

            migrationBuilder.RenameColumn(
                name: "IsDefault",
                table: "CommunityRoles",
                newName: "CanPinMessages");

            migrationBuilder.AddColumn<bool>(
                name: "CanBanMembers",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanCreateEvents",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditCommunitySettings",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanKickMembers",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanManageChannels",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanManageRoles",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanModerateChat",
                table: "CommunityRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_CommunityRoles_RoleId",
                table: "Profiles",
                column: "RoleId",
                principalTable: "CommunityRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
