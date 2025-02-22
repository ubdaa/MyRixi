using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedMediaModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImage",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "BannerImage",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "Metadata",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Attachments");

            migrationBuilder.AddColumn<Guid>(
                name: "CoverPictureId",
                table: "UserProfiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ProfilePictureId",
                table: "UserProfiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CoverPictureId",
                table: "CommunityProfiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ProfilePictureId",
                table: "CommunityProfiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CoverId",
                table: "Communities",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "IconId",
                table: "Communities",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "MediaId",
                table: "Attachments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Medias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Metadata = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medias", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_CoverPictureId",
                table: "UserProfiles",
                column: "CoverPictureId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_ProfilePictureId",
                table: "UserProfiles",
                column: "ProfilePictureId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_CoverPictureId",
                table: "CommunityProfiles",
                column: "CoverPictureId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_ProfilePictureId",
                table: "CommunityProfiles",
                column: "ProfilePictureId");

            migrationBuilder.CreateIndex(
                name: "IX_Communities_CoverId",
                table: "Communities",
                column: "CoverId");

            migrationBuilder.CreateIndex(
                name: "IX_Communities_IconId",
                table: "Communities",
                column: "IconId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_MediaId",
                table: "Attachments",
                column: "MediaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_Medias_MediaId",
                table: "Attachments",
                column: "MediaId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Communities_Medias_CoverId",
                table: "Communities",
                column: "CoverId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Communities_Medias_IconId",
                table: "Communities",
                column: "IconId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommunityProfiles_Medias_CoverPictureId",
                table: "CommunityProfiles",
                column: "CoverPictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommunityProfiles_Medias_ProfilePictureId",
                table: "CommunityProfiles",
                column: "ProfilePictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_Medias_CoverPictureId",
                table: "UserProfiles",
                column: "CoverPictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_Medias_ProfilePictureId",
                table: "UserProfiles",
                column: "ProfilePictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_Medias_MediaId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_Communities_Medias_CoverId",
                table: "Communities");

            migrationBuilder.DropForeignKey(
                name: "FK_Communities_Medias_IconId",
                table: "Communities");

            migrationBuilder.DropForeignKey(
                name: "FK_CommunityProfiles_Medias_CoverPictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_CommunityProfiles_Medias_ProfilePictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Medias_CoverPictureId",
                table: "UserProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Medias_ProfilePictureId",
                table: "UserProfiles");

            migrationBuilder.DropTable(
                name: "Medias");

            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_CoverPictureId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_ProfilePictureId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_CommunityProfiles_CoverPictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropIndex(
                name: "IX_CommunityProfiles_ProfilePictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropIndex(
                name: "IX_Communities_CoverId",
                table: "Communities");

            migrationBuilder.DropIndex(
                name: "IX_Communities_IconId",
                table: "Communities");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_MediaId",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "CoverPictureId",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "ProfilePictureId",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "CoverPictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropColumn(
                name: "ProfilePictureId",
                table: "CommunityProfiles");

            migrationBuilder.DropColumn(
                name: "CoverId",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "IconId",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "MediaId",
                table: "Attachments");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImage",
                table: "UserProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BannerImage",
                table: "Communities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                table: "Attachments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Attachments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Attachments",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
