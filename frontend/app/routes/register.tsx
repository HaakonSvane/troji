import type { registerUserMutation } from "@/__generated__/registerUserMutation.graphql";
import { useUser } from "@clerk/react-router";
import { useEffect, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterUserMutation = graphql`
    mutation registerUserMutation($input: RegisterUserInput!) {
        registerUser(input: $input) {
            user {
                id
                firstName
                lastName
            }
            errors {
                __typename
                ... on UserAlreadyRegisteredError {
                    message
                }
            }
        }
    }
`;

export default function RegisterPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [commitRegisterUser, isSubmitting] =
        useMutation<registerUserMutation>(RegisterUserMutation);

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (!firstName && user.firstName) {
            setFirstName(user.firstName);
        }

        if (!lastName && user.lastName) {
            setLastName(user.lastName);
        }
    }, [firstName, lastName, user]);

    const onSubmit = () => {
        setFormError(null);

        const normalizedFirstName = firstName.trim();
        const normalizedLastName = lastName.trim();
        const normalizedMiddleName = middleName.trim();

        if (!normalizedFirstName || !normalizedLastName) {
            setFormError("First name and last name are required.");
            return;
        }

        commitRegisterUser({
            variables: {
                input: {
                    firstName: normalizedFirstName,
                    middleName: normalizedMiddleName || null,
                    lastName: normalizedLastName,
                },
            },
            // @types/react-relay is v18 but react-relay is v20; onCompleted is typed as
            // (response: {}) in the older types, so a cast is required here.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.registerUser;

                if (payload?.user) {
                    navigate("/dashboard", { replace: true });
                    return;
                }

                const alreadyRegistered = payload?.errors?.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error: any) => error?.__typename === "UserAlreadyRegisteredError"
                );

                if (alreadyRegistered) {
                    navigate("/dashboard", { replace: true });
                    return;
                }

                setFormError("Could not complete registration. Please try again.");
            },
            onError: () => {
                setFormError("Could not complete registration. Please try again.");
            },
        });
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete your registration</CardTitle>
                    <CardDescription>
                        Add your name to create your profile in Trophy Tracker.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSubmit();
                        }}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                autoComplete="given-name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="middleName">Middle name (optional)</Label>
                            <Input
                                id="middleName"
                                name="middleName"
                                value={middleName}
                                onChange={(event) => setMiddleName(event.target.value)}
                                autoComplete="additional-name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                autoComplete="family-name"
                                required
                            />
                        </div>

                        {formError ? (
                            <p className="text-sm text-destructive" role="alert">
                                {formError}
                            </p>
                        ) : null}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Create profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
