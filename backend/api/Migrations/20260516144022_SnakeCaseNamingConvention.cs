using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SnakeCaseNamingConvention : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Groups_ParentGroupId",
                table: "Games");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupInvites_Groups_GroupId",
                table: "GroupInvites");

            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_AdminId",
                table: "Groups");

            migrationBuilder.DropForeignKey(
                name: "FK_Trophies_Games_GameId",
                table: "Trophies");

            migrationBuilder.DropForeignKey(
                name: "FK_Trophies_Users_ReceiverId",
                table: "Trophies");

            migrationBuilder.DropForeignKey(
                name: "FK_TrophyRequestApprovals_TrophyRequests_RequestId",
                table: "TrophyRequestApprovals");

            migrationBuilder.DropForeignKey(
                name: "FK_TrophyRequestApprovals_Users_UserId",
                table: "TrophyRequestApprovals");

            migrationBuilder.DropForeignKey(
                name: "FK_TrophyRequests_Trophies_TrophyId",
                table: "TrophyRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_UserGroups_Groups_GroupId",
                table: "UserGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_UserGroups_Users_UserId",
                table: "UserGroups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Trophies",
                table: "Trophies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups",
                table: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Games",
                table: "Games");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserGroups",
                table: "UserGroups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrophyRequests",
                table: "TrophyRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrophyRequestApprovals",
                table: "TrophyRequestApprovals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupInvites",
                table: "GroupInvites");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Trophies",
                newName: "trophies");

            migrationBuilder.RenameTable(
                name: "Groups",
                newName: "groups");

            migrationBuilder.RenameTable(
                name: "Games",
                newName: "games");

            migrationBuilder.RenameTable(
                name: "UserGroups",
                newName: "user_groups");

            migrationBuilder.RenameTable(
                name: "TrophyRequests",
                newName: "trophy_requests");

            migrationBuilder.RenameTable(
                name: "TrophyRequestApprovals",
                newName: "trophy_request_approvals");

            migrationBuilder.RenameTable(
                name: "GroupInvites",
                newName: "group_invites");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "MiddleName",
                table: "users",
                newName: "middle_name");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "users",
                newName: "last_name");

            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "users",
                newName: "image_id");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "users",
                newName: "first_name");

            migrationBuilder.RenameColumn(
                name: "DisplayName",
                table: "users",
                newName: "display_name");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Id",
                table: "users",
                newName: "ix_users_id");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "trophies",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "trophies",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                table: "trophies",
                newName: "receiver_id");

            migrationBuilder.RenameColumn(
                name: "GameId",
                table: "trophies",
                newName: "game_id");

            migrationBuilder.RenameColumn(
                name: "AwardedDate",
                table: "trophies",
                newName: "awarded_date");

            migrationBuilder.RenameIndex(
                name: "IX_Trophies_ReceiverId",
                table: "trophies",
                newName: "ix_trophies_receiver_id");

            migrationBuilder.RenameIndex(
                name: "IX_Trophies_GameId",
                table: "trophies",
                newName: "ix_trophies_game_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "groups",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "groups",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "groups",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "groups",
                newName: "image_id");

            migrationBuilder.RenameColumn(
                name: "DecisionModel",
                table: "groups",
                newName: "decision_model");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "groups",
                newName: "created_date");

            migrationBuilder.RenameColumn(
                name: "AdminId",
                table: "groups",
                newName: "admin_id");

            migrationBuilder.RenameIndex(
                name: "IX_Groups_AdminId",
                table: "groups",
                newName: "ix_groups_admin_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "games",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Emoji",
                table: "games",
                newName: "emoji");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "games",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "games",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ParentGroupId",
                table: "games",
                newName: "parent_group_id");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "games",
                newName: "created_date");

            migrationBuilder.RenameIndex(
                name: "IX_Games_ParentGroupId_Emoji",
                table: "games",
                newName: "ix_games_parent_group_id_emoji");

            migrationBuilder.RenameColumn(
                name: "JoinedAt",
                table: "user_groups",
                newName: "joined_at");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "user_groups",
                newName: "group_id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "user_groups",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_UserGroups_GroupId",
                table: "user_groups",
                newName: "ix_user_groups_group_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "trophy_requests",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TrophyId",
                table: "trophy_requests",
                newName: "trophy_id");

            migrationBuilder.RenameColumn(
                name: "IsApproved",
                table: "trophy_request_approvals",
                newName: "is_approved");

            migrationBuilder.RenameColumn(
                name: "RequestId",
                table: "trophy_request_approvals",
                newName: "request_id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "trophy_request_approvals",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_TrophyRequestApprovals_RequestId",
                table: "trophy_request_approvals",
                newName: "ix_trophy_request_approvals_request_id");

            migrationBuilder.RenameColumn(
                name: "NextAllowedResetDate",
                table: "group_invites",
                newName: "next_allowed_reset_date");

            migrationBuilder.RenameColumn(
                name: "InviteCode",
                table: "group_invites",
                newName: "invite_code");

            migrationBuilder.RenameColumn(
                name: "ExpirationDate",
                table: "group_invites",
                newName: "expiration_date");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "group_invites",
                newName: "group_id");

            migrationBuilder.RenameIndex(
                name: "IX_GroupInvites_InviteCode",
                table: "group_invites",
                newName: "ix_group_invites_invite_code");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_trophies",
                table: "trophies",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_groups",
                table: "groups",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_games",
                table: "games",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_groups",
                table: "user_groups",
                columns: new[] { "user_id", "group_id" });

            migrationBuilder.AddPrimaryKey(
                name: "pk_trophy_requests",
                table: "trophy_requests",
                column: "trophy_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_trophy_request_approvals",
                table: "trophy_request_approvals",
                columns: new[] { "user_id", "request_id" });

            migrationBuilder.AddPrimaryKey(
                name: "pk_group_invites",
                table: "group_invites",
                column: "group_id");

            migrationBuilder.AddForeignKey(
                name: "fk_games_groups_parent_group_id",
                table: "games",
                column: "parent_group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_group_invites_groups_group_id",
                table: "group_invites",
                column: "group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_groups_users_admin_id",
                table: "groups",
                column: "admin_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_trophies_games_game_id",
                table: "trophies",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_trophies_users_receiver_id",
                table: "trophies",
                column: "receiver_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_trophy_request_approvals_trophy_requests_request_id",
                table: "trophy_request_approvals",
                column: "request_id",
                principalTable: "trophy_requests",
                principalColumn: "trophy_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_trophy_request_approvals_users_user_id",
                table: "trophy_request_approvals",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_trophy_requests_trophies_trophy_id",
                table: "trophy_requests",
                column: "trophy_id",
                principalTable: "trophies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_groups_groups_group_id",
                table: "user_groups",
                column: "group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_groups_users_user_id",
                table: "user_groups",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_games_groups_parent_group_id",
                table: "games");

            migrationBuilder.DropForeignKey(
                name: "fk_group_invites_groups_group_id",
                table: "group_invites");

            migrationBuilder.DropForeignKey(
                name: "fk_groups_users_admin_id",
                table: "groups");

            migrationBuilder.DropForeignKey(
                name: "fk_trophies_games_game_id",
                table: "trophies");

            migrationBuilder.DropForeignKey(
                name: "fk_trophies_users_receiver_id",
                table: "trophies");

            migrationBuilder.DropForeignKey(
                name: "fk_trophy_request_approvals_trophy_requests_request_id",
                table: "trophy_request_approvals");

            migrationBuilder.DropForeignKey(
                name: "fk_trophy_request_approvals_users_user_id",
                table: "trophy_request_approvals");

            migrationBuilder.DropForeignKey(
                name: "fk_trophy_requests_trophies_trophy_id",
                table: "trophy_requests");

            migrationBuilder.DropForeignKey(
                name: "fk_user_groups_groups_group_id",
                table: "user_groups");

            migrationBuilder.DropForeignKey(
                name: "fk_user_groups_users_user_id",
                table: "user_groups");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_trophies",
                table: "trophies");

            migrationBuilder.DropPrimaryKey(
                name: "pk_groups",
                table: "groups");

            migrationBuilder.DropPrimaryKey(
                name: "pk_games",
                table: "games");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_groups",
                table: "user_groups");

            migrationBuilder.DropPrimaryKey(
                name: "pk_trophy_requests",
                table: "trophy_requests");

            migrationBuilder.DropPrimaryKey(
                name: "pk_trophy_request_approvals",
                table: "trophy_request_approvals");

            migrationBuilder.DropPrimaryKey(
                name: "pk_group_invites",
                table: "group_invites");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "trophies",
                newName: "Trophies");

            migrationBuilder.RenameTable(
                name: "groups",
                newName: "Groups");

            migrationBuilder.RenameTable(
                name: "games",
                newName: "Games");

            migrationBuilder.RenameTable(
                name: "user_groups",
                newName: "UserGroups");

            migrationBuilder.RenameTable(
                name: "trophy_requests",
                newName: "TrophyRequests");

            migrationBuilder.RenameTable(
                name: "trophy_request_approvals",
                newName: "TrophyRequestApprovals");

            migrationBuilder.RenameTable(
                name: "group_invites",
                newName: "GroupInvites");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "middle_name",
                table: "Users",
                newName: "MiddleName");

            migrationBuilder.RenameColumn(
                name: "last_name",
                table: "Users",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "image_id",
                table: "Users",
                newName: "ImageId");

            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "Users",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "display_name",
                table: "Users",
                newName: "DisplayName");

            migrationBuilder.RenameIndex(
                name: "ix_users_id",
                table: "Users",
                newName: "IX_Users_Id");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Trophies",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Trophies",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "receiver_id",
                table: "Trophies",
                newName: "ReceiverId");

            migrationBuilder.RenameColumn(
                name: "game_id",
                table: "Trophies",
                newName: "GameId");

            migrationBuilder.RenameColumn(
                name: "awarded_date",
                table: "Trophies",
                newName: "AwardedDate");

            migrationBuilder.RenameIndex(
                name: "ix_trophies_receiver_id",
                table: "Trophies",
                newName: "IX_Trophies_ReceiverId");

            migrationBuilder.RenameIndex(
                name: "ix_trophies_game_id",
                table: "Trophies",
                newName: "IX_Trophies_GameId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Groups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Groups",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Groups",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "image_id",
                table: "Groups",
                newName: "ImageId");

            migrationBuilder.RenameColumn(
                name: "decision_model",
                table: "Groups",
                newName: "DecisionModel");

            migrationBuilder.RenameColumn(
                name: "created_date",
                table: "Groups",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "admin_id",
                table: "Groups",
                newName: "AdminId");

            migrationBuilder.RenameIndex(
                name: "ix_groups_admin_id",
                table: "Groups",
                newName: "IX_Groups_AdminId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Games",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "emoji",
                table: "Games",
                newName: "Emoji");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Games",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Games",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "parent_group_id",
                table: "Games",
                newName: "ParentGroupId");

            migrationBuilder.RenameColumn(
                name: "created_date",
                table: "Games",
                newName: "CreatedDate");

            migrationBuilder.RenameIndex(
                name: "ix_games_parent_group_id_emoji",
                table: "Games",
                newName: "IX_Games_ParentGroupId_Emoji");

            migrationBuilder.RenameColumn(
                name: "joined_at",
                table: "UserGroups",
                newName: "JoinedAt");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "UserGroups",
                newName: "GroupId");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "UserGroups",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "ix_user_groups_group_id",
                table: "UserGroups",
                newName: "IX_UserGroups_GroupId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "TrophyRequests",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "trophy_id",
                table: "TrophyRequests",
                newName: "TrophyId");

            migrationBuilder.RenameColumn(
                name: "is_approved",
                table: "TrophyRequestApprovals",
                newName: "IsApproved");

            migrationBuilder.RenameColumn(
                name: "request_id",
                table: "TrophyRequestApprovals",
                newName: "RequestId");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "TrophyRequestApprovals",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "ix_trophy_request_approvals_request_id",
                table: "TrophyRequestApprovals",
                newName: "IX_TrophyRequestApprovals_RequestId");

            migrationBuilder.RenameColumn(
                name: "next_allowed_reset_date",
                table: "GroupInvites",
                newName: "NextAllowedResetDate");

            migrationBuilder.RenameColumn(
                name: "invite_code",
                table: "GroupInvites",
                newName: "InviteCode");

            migrationBuilder.RenameColumn(
                name: "expiration_date",
                table: "GroupInvites",
                newName: "ExpirationDate");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "GroupInvites",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "ix_group_invites_invite_code",
                table: "GroupInvites",
                newName: "IX_GroupInvites_InviteCode");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Trophies",
                table: "Trophies",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups",
                table: "Groups",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Games",
                table: "Games",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserGroups",
                table: "UserGroups",
                columns: new[] { "UserId", "GroupId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrophyRequests",
                table: "TrophyRequests",
                column: "TrophyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrophyRequestApprovals",
                table: "TrophyRequestApprovals",
                columns: new[] { "UserId", "RequestId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupInvites",
                table: "GroupInvites",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Groups_ParentGroupId",
                table: "Games",
                column: "ParentGroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupInvites_Groups_GroupId",
                table: "GroupInvites",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_AdminId",
                table: "Groups",
                column: "AdminId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Trophies_Games_GameId",
                table: "Trophies",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Trophies_Users_ReceiverId",
                table: "Trophies",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrophyRequestApprovals_TrophyRequests_RequestId",
                table: "TrophyRequestApprovals",
                column: "RequestId",
                principalTable: "TrophyRequests",
                principalColumn: "TrophyId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrophyRequestApprovals_Users_UserId",
                table: "TrophyRequestApprovals",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrophyRequests_Trophies_TrophyId",
                table: "TrophyRequests",
                column: "TrophyId",
                principalTable: "Trophies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserGroups_Groups_GroupId",
                table: "UserGroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserGroups_Users_UserId",
                table: "UserGroups",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
