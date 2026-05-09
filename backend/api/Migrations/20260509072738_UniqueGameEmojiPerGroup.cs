using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UniqueGameEmojiPerGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Games_ParentGroupId",
                table: "Games");

            migrationBuilder.CreateIndex(
                name: "IX_Games_ParentGroupId_Emoji",
                table: "Games",
                columns: new[] { "ParentGroupId", "Emoji" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Games_ParentGroupId_Emoji",
                table: "Games");

            migrationBuilder.CreateIndex(
                name: "IX_Games_ParentGroupId",
                table: "Games",
                column: "ParentGroupId");
        }
    }
}
