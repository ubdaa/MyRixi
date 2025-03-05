using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyRixiApi.Migrations
{
    /// <inheritdoc />
    public partial class RestructurationSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_CommunityProfiles_CommunityProfileId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_UserProfiles_UserProfileId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_CommunityProfiles_CommunityProfileId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId",
                table: "UserProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Medias_CoverPictureId",
                table: "UserProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Medias_ProfilePictureId",
                table: "UserProfiles");

            migrationBuilder.DropTable(
                name: "CommunityProfiles");

            migrationBuilder.DropTable(
                name: "ConversationUser");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Comments_CommunityProfileId",
                table: "Comments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserProfiles",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "CommunityProfileId",
                table: "Comments");

            migrationBuilder.RenameTable(
                name: "UserProfiles",
                newName: "Profiles");

            migrationBuilder.RenameColumn(
                name: "UserProfileId",
                table: "Comments",
                newName: "ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserProfileId",
                table: "Comments",
                newName: "IX_Comments_ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_UserProfiles_ProfilePictureId",
                table: "Profiles",
                newName: "IX_Profiles_ProfilePictureId");

            migrationBuilder.RenameIndex(
                name: "IX_UserProfiles_CoverPictureId",
                table: "Profiles",
                newName: "IX_Profiles_CoverPictureId");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Profiles",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "JoinedAt",
                table: "Profiles",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Profiles",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<string>(
                name: "AccentColor",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "AllowDirectMessages",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BackgroundColor",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ChannelId",
                table: "Profiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CommunityId",
                table: "Profiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Profiles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "Profiles",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "JoinStatus",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedInProfile",
                table: "Profiles",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalWebsite",
                table: "Profiles",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileType",
                table: "Profiles",
                type: "character varying(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Pseudonym",
                table: "Profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RoleId",
                table: "Profiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SuspendedUntil",
                table: "Profiles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterHandle",
                table: "Profiles",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserProfile_UserId",
                table: "Profiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Profiles",
                table: "Profiles",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CommunityRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CanManageChannels = table.Column<bool>(type: "boolean", nullable: false),
                    CanKickMembers = table.Column<bool>(type: "boolean", nullable: false),
                    CanBanMembers = table.Column<bool>(type: "boolean", nullable: false),
                    CanModerateChat = table.Column<bool>(type: "boolean", nullable: false),
                    CanEditCommunitySettings = table.Column<bool>(type: "boolean", nullable: false),
                    CanPinMessages = table.Column<bool>(type: "boolean", nullable: false),
                    CanCreateEvents = table.Column<bool>(type: "boolean", nullable: false),
                    CanManageRoles = table.Column<bool>(type: "boolean", nullable: false),
                    IsAdministrator = table.Column<bool>(type: "boolean", nullable: false),
                    CommunityId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommunityRoles_Communities_CommunityId",
                        column: x => x.CommunityId,
                        principalTable: "Communities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_ChannelId",
                table: "Profiles",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_CommunityId",
                table: "Profiles",
                column: "CommunityId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_RoleId",
                table: "Profiles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserProfile_UserId",
                table: "Profiles",
                column: "UserProfile_UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommunityRoles_CommunityId",
                table: "CommunityRoles",
                column: "CommunityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Profiles_ProfileId",
                table: "Comments",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Profiles_CommunityProfileId",
                table: "Posts",
                column: "CommunityProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_AspNetUsers_UserId",
                table: "Profiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_AspNetUsers_UserProfile_UserId",
                table: "Profiles",
                column: "UserProfile_UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Channels_ChannelId",
                table: "Profiles",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Communities_CommunityId",
                table: "Profiles",
                column: "CommunityId",
                principalTable: "Communities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_CommunityRoles_RoleId",
                table: "Profiles",
                column: "RoleId",
                principalTable: "CommunityRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Medias_CoverPictureId",
                table: "Profiles",
                column: "CoverPictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Medias_ProfilePictureId",
                table: "Profiles",
                column: "ProfilePictureId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Profiles_ProfileId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Profiles_CommunityProfileId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_AspNetUsers_UserId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_AspNetUsers_UserProfile_UserId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Channels_ChannelId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Communities_CommunityId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_CommunityRoles_RoleId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Medias_CoverPictureId",
                table: "Profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Medias_ProfilePictureId",
                table: "Profiles");

            migrationBuilder.DropTable(
                name: "CommunityRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Profiles",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_ChannelId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_CommunityId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_RoleId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_UserProfile_UserId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "AccentColor",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "AllowDirectMessages",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "BackgroundColor",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CommunityId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "JoinStatus",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LinkedInProfile",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "PersonalWebsite",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProfileType",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Pseudonym",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "SuspendedUntil",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "TwitterHandle",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "UserProfile_UserId",
                table: "Profiles");

            migrationBuilder.RenameTable(
                name: "Profiles",
                newName: "UserProfiles");

            migrationBuilder.RenameColumn(
                name: "ProfileId",
                table: "Comments",
                newName: "UserProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ProfileId",
                table: "Comments",
                newName: "IX_Comments_UserProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Profiles_ProfilePictureId",
                table: "UserProfiles",
                newName: "IX_UserProfiles_ProfilePictureId");

            migrationBuilder.RenameIndex(
                name: "IX_Profiles_CoverPictureId",
                table: "UserProfiles",
                newName: "IX_UserProfiles_CoverPictureId");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.AddColumn<Guid>(
                name: "ConversationId",
                table: "Messages",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CommunityProfileId",
                table: "Comments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "UserProfiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "JoinedAt",
                table: "UserProfiles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "UserProfiles",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "uuid_generate_v4()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserProfiles",
                table: "UserProfiles",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CommunityProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CommunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CoverPictureId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfilePictureId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsBanned = table.Column<bool>(type: "boolean", nullable: false),
                    IsOwner = table.Column<bool>(type: "boolean", nullable: false),
                    IsSuspended = table.Column<bool>(type: "boolean", nullable: false),
                    JoinStatus = table.Column<int>(type: "integer", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Preferences = table.Column<string>(type: "text", nullable: false),
                    Pseudonym = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommunityProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommunityProfiles_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "Channels",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CommunityProfiles_Communities_CommunityId",
                        column: x => x.CommunityId,
                        principalTable: "Communities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommunityProfiles_Medias_CoverPictureId",
                        column: x => x.CoverPictureId,
                        principalTable: "Medias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommunityProfiles_Medias_ProfilePictureId",
                        column: x => x.ProfilePictureId,
                        principalTable: "Medias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConversationUser",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ParticipantsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationUser", x => new { x.ConversationId, x.ParticipantsId });
                    table.ForeignKey(
                        name: "FK_ConversationUser_AspNetUsers_ParticipantsId",
                        column: x => x.ParticipantsId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationUser_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CommunityProfileId",
                table: "Comments",
                column: "CommunityProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_ChannelId",
                table: "CommunityProfiles",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_CommunityId",
                table: "CommunityProfiles",
                column: "CommunityId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_CoverPictureId",
                table: "CommunityProfiles",
                column: "CoverPictureId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_ProfilePictureId",
                table: "CommunityProfiles",
                column: "ProfilePictureId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityProfiles_UserId",
                table: "CommunityProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationUser_ParticipantsId",
                table: "ConversationUser",
                column: "ParticipantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId",
                principalTable: "Comments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_CommunityProfiles_CommunityProfileId",
                table: "Comments",
                column: "CommunityProfileId",
                principalTable: "CommunityProfiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_UserProfiles_UserProfileId",
                table: "Comments",
                column: "UserProfileId",
                principalTable: "UserProfiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_CommunityProfiles_CommunityProfileId",
                table: "Posts",
                column: "CommunityProfileId",
                principalTable: "CommunityProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId",
                table: "UserProfiles",
                column: "UserId",
                principalTable: "AspNetUsers",
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
    }
}
