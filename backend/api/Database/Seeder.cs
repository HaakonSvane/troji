using api.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Database;

public static class Seeder
{
    public static async Task SeedAsync(TrophyDbContext db, string myUserId)
    {
        // Idempotency guard — if Alice is already in the DB this seed has run before.
        if (await db.Users.AnyAsync(u => u.Id == "user_seed_alice001"))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;

        // ── Users ─────────────────────────────────────────────────────────
        // The dev user may already exist if they have registered via Clerk before seeding.
        var me = await db.Users.FindAsync(myUserId)
                 ?? db.Users.Add(new User { Id = myUserId, DisplayName = "Dev User", FirstName = "Dev", LastName = "User" }).Entity;
        var alice = new User { Id = "user_seed_alice001", DisplayName = "Alice Andersen", FirstName = "Alice", LastName = "Andersen" };
        var bob = new User { Id = "user_seed_bob001", DisplayName = "Bob Bergström", FirstName = "Bob", LastName = "Bergström" };
        var carol = new User { Id = "user_seed_carol001", DisplayName = "Carol Chen", FirstName = "Carol", LastName = "Chen" };
        var hans = new User { Id = "user_seed_hans001", DisplayName = "Hans Kristoph", FirstName = "Hans", MiddleName = "Oluf", LastName = "Kristoph" };

        db.Users.AddRange(alice, bob, carol, hans);
        await db.SaveChangesAsync();

        // ── Groups ────────────────────────────────────────────────────────
        var friday = new Group
        {
            Name = "Friday Game Night",
            Description = "Weekly games with friends. All skill levels welcome.",
            AdminId = myUserId,
            DecisionModel = Group.RuleType.Open,
            CreatedDate = now.AddMonths(-3),
        };
        var office = new Group
        {
            Name = "Office Champions",
            Description = "Internal league for the office crew.",
            AdminId = bob.Id,
            DecisionModel = Group.RuleType.Open,
            CreatedDate = now.AddMonths(-1),
        };

        // "Board Game Café" — Carol is admin, you are NOT a member. Use invite code to join.
        var cafe = new Group
        {
            Name = "Board Game Café",
            Description = "Carol's casual group. Join with the invite to test the onboarding flow.",
            AdminId = carol.Id,
            DecisionModel = Group.RuleType.Open,
            CreatedDate = now.AddDays(-7),
        };

        db.Groups.AddRange(friday, office, cafe);
        await db.SaveChangesAsync();

        // ── UserGroups ────────────────────────────────────────────────────
        db.UserGroups.AddRange(
            new UserGroup { UserId = myUserId, GroupId = friday.Id, JoinedAt = friday.CreatedDate },
            new UserGroup { UserId = alice.Id, GroupId = friday.Id, JoinedAt = friday.CreatedDate },
            new UserGroup { UserId = bob.Id, GroupId = friday.Id, JoinedAt = friday.CreatedDate },

            new UserGroup { UserId = bob.Id, GroupId = office.Id, JoinedAt = office.CreatedDate },
            new UserGroup { UserId = myUserId, GroupId = office.Id, JoinedAt = office.CreatedDate },
            new UserGroup { UserId = carol.Id, GroupId = office.Id, JoinedAt = office.CreatedDate },
            new UserGroup { UserId = hans.Id, GroupId = office.Id, JoinedAt = office.CreatedDate },
            // café — you are intentionally NOT a member here
            new UserGroup { UserId = carol.Id, GroupId = cafe.Id, JoinedAt = cafe.CreatedDate },
            new UserGroup { UserId = alice.Id, GroupId = cafe.Id, JoinedAt = cafe.CreatedDate }
        );

        // ── GroupInvites ──────────────────────────────────────────────────
        db.GroupInvites.AddRange(
            new GroupInvite
            {
                GroupId = friday.Id,
                InviteCode = "FRI-SEED",
                ExpirationDate = now.AddDays(30),
                NextAllowedResetDate = now.AddDays(1),
            },
            new GroupInvite
            {
                GroupId = office.Id,
                InviteCode = "OFC-SEED",
                ExpirationDate = now.AddDays(30),
                NextAllowedResetDate = now.AddDays(1),
            },
            new GroupInvite
            {
                GroupId = cafe.Id,
                InviteCode = "CAF-SEED",
                ExpirationDate = now.AddDays(30),
                NextAllowedResetDate = now.AddDays(1),
            }
        );

        await db.SaveChangesAsync();

        // ── Games ─────────────────────────────────────────────────────────
        var chess = new Game { Name = "Chess", Emoji = "♟️", ParentGroupId = friday.Id, CreatedDate = now.AddMonths(-3) };
        var scrabble = new Game { Name = "Scrabble", Emoji = "🔤", ParentGroupId = friday.Id, CreatedDate = now.AddMonths(-2) };
        var darts = new Game { Name = "Darts", Emoji = "🎯", ParentGroupId = friday.Id, CreatedDate = now.AddMonths(-1) };
        var pingpong = new Game { Name = "Ping Pong", Emoji = "🏓", ParentGroupId = office.Id, CreatedDate = now.AddMonths(-1) };
        var trivia = new Game { Name = "Trivia", Emoji = "🧠", ParentGroupId = office.Id, CreatedDate = now.AddDays(-14) };

        db.Games.AddRange(chess, scrabble, darts, pingpong, trivia);
        await db.SaveChangesAsync();

        // ── Trophies + Requests + Approvals ───────────────────────────────

        // Alice won Chess — fully awarded
        var aliceChessTrophy = new Trophy
        {
            GameId = chess.Id,
            ReceiverId = alice.Id,
            Description = "Unbeaten across three consecutive Friday evenings.",
            AwardedDate = now.AddMonths(-2),
        };

        // Bob won Scrabble — fully awarded
        var bobScrabbleTrophy = new Trophy
        {
            GameId = scrabble.Id,
            ReceiverId = bob.Id,
            Description = "Triple-word score master.",
            AwardedDate = now.AddMonths(-1),
        };

        // I have a PENDING Darts request — mixed approvals, not yet awarded
        var myDartsTrophy = new Trophy
        {
            GameId = darts.Id,
            ReceiverId = myUserId,
            Description = "Hit three bullseyes in a row on the first attempt.",
            AwardedDate = null,
        };

        // I won Ping Pong in Office — fully awarded
        var myPingPongTrophy = new Trophy
        {
            GameId = pingpong.Id,
            ReceiverId = myUserId,
            Description = "Undefeated in the first office round-robin.",
            AwardedDate = now.AddDays(-7),
        };

        db.Trophies.AddRange(aliceChessTrophy, bobScrabbleTrophy, myDartsTrophy, myPingPongTrophy);
        await db.SaveChangesAsync();

        db.TrophyRequests.AddRange(
            new TrophyRequest { TrophyId = aliceChessTrophy.Id },
            new TrophyRequest { TrophyId = bobScrabbleTrophy.Id },
            new TrophyRequest { TrophyId = myDartsTrophy.Id },
            new TrophyRequest { TrophyId = myPingPongTrophy.Id }
        );
        await db.SaveChangesAsync();

        // Approvals for the pending Darts request only (awarded trophies need none).
        // TrophyRequest's [Key] is TrophyId, so RequestId == myDartsTrophy.Id directly.
        db.TrophyRequestApprovals.AddRange(
            new TrophyRequestApproval { UserId = alice.Id, RequestId = myDartsTrophy.Id, IsApproved = true },
            new TrophyRequestApproval { UserId = bob.Id, RequestId = myDartsTrophy.Id, IsApproved = false }
        );
        await db.SaveChangesAsync();

    }
}
