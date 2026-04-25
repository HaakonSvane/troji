using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class OpenOnlyGroupRule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Groups\" SET \"DecisionModel\" = 0;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Data-only migration cannot restore previous decision model values.
        }
    }
}
