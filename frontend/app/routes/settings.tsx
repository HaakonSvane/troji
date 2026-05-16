import { useState } from "react";
import { graphql, loadQuery, useMutation, usePreloadedQuery } from "react-relay";
import type { settingsQuery } from "@/__generated__/settingsQuery.graphql";
import type { settingsMutation } from "@/__generated__/settingsMutation.graphql";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getRelayEnvironment } from "@/relay/environment";
import { validateUpdateUserInput } from "@/lib/validation/forms";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Route } from "./+types/settings";

const SettingsPageQuery = graphql`
    query settingsQuery {
        me {
            id
            firstName
            middleName
            lastName
        }
    }
`;

const UpdateUserMutation = graphql`
    mutation settingsMutation($input: UpdateUserInput!) {
        updateUser(input: $input) {
            user {
                id
                firstName
                middleName
                lastName
            }
            errors {
                __typename
                ... on NoUserError {
                    message
                }
            }
        }
    }
`;

export function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<settingsQuery>(environment, SettingsPageQuery, {});
    return { queryRef };
}

export function HydrateFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-medal-gold/40 border-t-medal-gold" />
                <span>loading</span>
            </div>
        </div>
    );
}

export function meta() {
    return [{ title: "Settings — Troji" }];
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(SettingsPageQuery, loaderData.queryRef);
    const [commitUpdateUser, isSubmitting] = useMutation<settingsMutation>(UpdateUserMutation);

    const [firstName, setFirstName] = useState(data.me?.firstName ?? "");
    const [middleName, setMiddleName] = useState(data.me?.middleName ?? "");
    const [lastName, setLastName] = useState(data.me?.lastName ?? "");
    const [formError, setFormError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const onSubmit = () => {
        setFormError(null);
        setSaved(false);

        const validation = validateUpdateUserInput({ firstName, middleName, lastName });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        const fallbackError = "Could not save changes. Please try again.";

        commitUpdateUser({
            variables: { input: validation.data },
            onCompleted: (response) => {
                const payload = response.updateUser;
                if (payload?.user) {
                    setSaved(true);
                    return;
                }
                setFormError(getMutationErrorMessage(payload?.errors, fallbackError));
            },
            onError: (error) => {
                setFormError(getMutationNetworkErrorMessage(error, fallbackError));
            },
        });
    };

    return (
        <main className="container mx-auto flex flex-col px-4 py-10 sm:py-14">
            <Breadcrumb segments={[{ label: "settings" }]} />

            <h1 className="mt-6 font-heading text-4xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                Settings
            </h1>

            <form
                className="mt-10 flex max-w-sm flex-col gap-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
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
                        onChange={(e) => { setFirstName(e.target.value); setSaved(false); }}
                        autoComplete="given-name"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="middleName"
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                        Middle name{" "}
                        <span className="lowercase tracking-normal">(optional)</span>
                    </Label>
                    <Input
                        id="middleName"
                        name="middleName"
                        value={middleName}
                        onChange={(e) => { setMiddleName(e.target.value); setSaved(false); }}
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
                        onChange={(e) => { setLastName(e.target.value); setSaved(false); }}
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

                {saved ? (
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-medal-gold">
                        <span aria-hidden className="mr-2">✓</span>
                        Saved
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
                    <span>{isSubmitting ? "saving" : "save changes"}</span>
                </Button>
            </form>
        </main>
    );
}
