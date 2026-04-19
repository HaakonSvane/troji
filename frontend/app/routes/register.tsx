// Phase 5.3: implement the full registration form and registerUser mutation here.
// This page is reached when a Clerk-authenticated user does not yet have a backend
// User/UserProfile record. The clientLoader of protected routes detects this by
// catching a GraphQL `NoUserError` on the `me` query and redirecting here.
//
// Note: the backend also needs a 1-line fix in UserQueries.GetMeAsync to throw
// NoUserException when `dbUser` is null (currently only thrown when token is missing).

export default function RegisterPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl font-semibold">Complete your registration</h1>
            <p className="text-muted-foreground">
                Registration form coming in Phase 5.3.
            </p>
        </div>
    );
}
