import type { registerUserMutation } from "@/__generated__/registerUserMutation.graphql";
import { getAuth } from "@clerk/react-router/server";
import { useUser } from "@clerk/react-router";
import { useEffect, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { redirect, useNavigate } from "react-router";
import { AuthShell } from "@/components/AuthShell";
import type { Route } from "./+types/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TerminalCursor } from "@/components/TerminalCursor";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { validateRegisterUserInput } from "@/lib/validation/forms";

const RegisterUserMutation = graphql`
    mutation registerUserMutation($input: RegisterUserInput!) {
        registerUser(input: $input) {
            user {
                id
                displayName
            }
            errors {
                __typename
                ... on Error {
                    message
                }
            }
        }
    }
`;

export async function loader(args: Route.LoaderArgs) {
    const { isAuthenticated } = await getAuth(args);
    if (!isAuthenticated) {
        throw redirect("/sign-in");
    }
    return {};
}

export function meta() {
    return [
        { title: "Set Up Profile — Troji" },
        { name: "description", content: "Pick your handle before you enter the arena." },
    ];
}

export default function RegisterPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [commitRegisterUser, isSubmitting] =
        useMutation<registerUserMutation>(RegisterUserMutation);

    const [displayName, setDisplayName] = useState("");
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

        const validation = validateRegisterUserInput({
            displayName,
            firstName,
            middleName,
            lastName,
        });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        commitRegisterUser({
            variables: { input: validation.data },
            onCompleted: (response) => {
                const payload = response.registerUser;

                if (payload.user) {
                    navigate("/dashboard", { replace: true });
                    return;
                }

                const alreadyRegistered = payload.errors?.some(
                    (error) => error.__typename === "UserAlreadyRegisteredError"
                );

                if (alreadyRegistered) {
                    navigate("/dashboard", { replace: true });
                    return;
                }

                setFormError(
                    getMutationErrorMessage(
                        payload.errors,
                        "Could not complete registration. Please try again."
                    )
                );
            },
            onError: (error) => {
                setFormError(
                    getMutationNetworkErrorMessage(
                        error,
                        "Could not complete registration. Please try again."
                    )
                );
            },
        });
    };

    const displayNamePlaceholder = [firstName, lastName]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ");

    return (
        <AuthShell prompt="pick your handle" headline="What name goes on the trophy?">
            <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="displayName"
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                        Display name
                    </Label>
                    <Input
                        id="displayName"
                        name="displayName"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        autoComplete="nickname"
                        placeholder={displayNamePlaceholder || "How others see you"}
                        maxLength={32}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="firstName"
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                        First name
                    </Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="middleName"
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                        Middle name <span className="lowercase tracking-normal">(optional)</span>
                    </Label>
                    <Input
                        id="middleName"
                        name="middleName"
                        value={middleName}
                        onChange={(event) => setMiddleName(event.target.value)}
                        autoComplete="additional-name"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="lastName"
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                        Last name
                    </Label>
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
                    <p
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-destructive"
                        role="alert"
                    >
                        <span aria-hidden className="mr-2">!</span>
                        {formError}
                    </p>
                ) : null}

                <Button
                    type="submit"
                    variant="gold"
                    size="terminal"
                    disabled={isSubmitting}
                    className="mt-2"
                >
                    <span aria-hidden>▸</span>
                    <span>{isSubmitting ? "saving" : "enter the arena"}</span>
                    <TerminalCursor />
                </Button>
            </form>
        </AuthShell>
    );
}
