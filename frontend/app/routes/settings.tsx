import { useState } from "react";
import { useAuth } from "@clerk/react-router";
import {
    fetchQuery,
    graphql,
    loadQuery,
    useMutation,
    usePreloadedQuery,
    useRelayEnvironment,
} from "react-relay";
import type { settingsQuery } from "@/__generated__/settingsQuery.graphql";
import type { settingsDisplayNameMutation } from "@/__generated__/settingsDisplayNameMutation.graphql";
import type { settingsProfileMutation } from "@/__generated__/settingsProfileMutation.graphql";
import type { settingsClearAvatarMutation } from "@/__generated__/settingsClearAvatarMutation.graphql";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
    ImageUploadField,
    useImageUploadFieldStatus,
} from "@/components/ImageUploadField";
import { UserAvatar } from "@/components/UserAvatar";
import { getRelayEnvironment } from "@/relay/environment";
import {
    validateUpdateDisplayNameInput,
    validateUpdateProfileInput,
} from "@/lib/validation/forms";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { uploadAvatar } from "@/lib/uploadImage";
import { preloadImage } from "@/lib/preloadImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Route } from "./+types/settings";

const SettingsPageQuery = graphql`
    query settingsQuery {
        me {
            id
            displayName
            avatarUrl(size: 256)
            navAvatarUrl: avatarUrl(size: 64)
            profile {
                firstName
                middleName
                lastName
            }
        }
    }
`;

const UpdateDisplayNameMutation = graphql`
    mutation settingsDisplayNameMutation($input: UpdateUserDisplayNameInput!) {
        updateUserDisplayName(input: $input) {
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

const UpdateProfileMutation = graphql`
    mutation settingsProfileMutation($input: UpdateUserProfileInput!) {
        updateUserProfile(input: $input) {
            user {
                id
                profile {
                    firstName
                    middleName
                    lastName
                }
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

const ClearAvatarMutation = graphql`
    mutation settingsClearAvatarMutation {
        clearUserAvatar {
            user {
                id
                avatarUrl(size: 256)
                navAvatarUrl: avatarUrl(size: 64)
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

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-medal-gold">$</span>
            <span className="ml-2">{children}</span>
        </p>
    );
}

interface AvatarFieldProps {
    displayName: string;
    avatarUrl: string | null | undefined;
}

function AvatarDisplay({
    displayName,
    avatarUrl,
}: {
    displayName: string;
    avatarUrl: string | null | undefined;
}) {
    const { busy } = useImageUploadFieldStatus();
    return (
        <UserAvatar
            displayName={displayName}
            avatarUrl={avatarUrl}
            size="lg"
            loading={busy}
        />
    );
}

function AvatarField({ displayName, avatarUrl }: AvatarFieldProps) {
    const { getToken } = useAuth();
    const environment = useRelayEnvironment();
    const [commitClear] =
        useMutation<settingsClearAvatarMutation>(ClearAvatarMutation);

    const hasImage = avatarUrl != null;

    const handleUpload = async (file: File) => {
        await uploadAvatar(file, () => getToken());
        // Refetch the canonical signed URL, then preload it into the browser
        // cache so the skeleton can flip straight to the rendered image
        // without Radix's fallback initials flashing in between.
        try {
            const result = await fetchQuery<settingsQuery>(
                environment,
                SettingsPageQuery,
                {}
            ).toPromise();
            const nextUrl = result?.me?.avatarUrl;
            if (nextUrl) {
                await preloadImage(nextUrl);
            }
        } catch (err) {
            console.error("Avatar refetch failed after successful upload", err);
        }
    };

    const handleRemove = () =>
        new Promise<void>((resolve, reject) => {
            commitClear({
                variables: {},
                onCompleted: (response) => {
                    const payload = response.clearUserAvatar;
                    if (!payload?.user) {
                        reject(
                            new Error(
                                getMutationErrorMessage(
                                    payload?.errors,
                                    "Could not remove avatar."
                                )
                            )
                        );
                        return;
                    }
                    resolve();
                },
                onError: (err) => {
                    reject(
                        new Error(
                            getMutationNetworkErrorMessage(err, "Could not remove avatar.")
                        )
                    );
                },
            });
        });

    return (
        <ImageUploadField
            hasImage={hasImage}
            onUpload={handleUpload}
            onRemove={handleRemove}
            confirmRemove={{
                title: "Remove avatar?",
                description:
                    "Your initials will be shown instead. You can upload a new image any time.",
                confirmLabel: "Remove avatar",
            }}
        >
            <div className="flex items-center gap-4">
                <ImageUploadField.Display>
                    <AvatarDisplay displayName={displayName} avatarUrl={avatarUrl} />
                </ImageUploadField.Display>
                <div className="flex flex-col gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        avatar
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <ImageUploadField.UploadTrigger />
                        <ImageUploadField.RemoveTrigger />
                    </div>
                    <ImageUploadField.Error />
                </div>
            </div>
        </ImageUploadField>
    );
}

interface IdentityCardProps {
    displayName: string;
    initialDisplayName: string;
    avatarUrl: string | null | undefined;
    onChange: (next: string) => void;
}

function IdentityCard({
    displayName,
    initialDisplayName,
    avatarUrl,
    onChange,
}: IdentityCardProps) {
    const [commitDisplayName, isSubmitting] =
        useMutation<settingsDisplayNameMutation>(UpdateDisplayNameMutation);
    const [formError, setFormError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const dirty = displayName.trim() !== initialDisplayName.trim();
    const fallbackError = "Could not save changes. Please try again.";

    const onSubmit = () => {
        setFormError(null);
        setSaved(false);

        if (!dirty) {
            setSaved(true);
            return;
        }

        const validation = validateUpdateDisplayNameInput({ displayName });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        commitDisplayName({
            variables: { input: validation.data },
            onCompleted: (response) => {
                const payload = response.updateUserDisplayName;
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
        <section className="flex flex-col gap-4">
            <SectionLabel>identity</SectionLabel>
            <form
                className="surface-card flex flex-col gap-5 p-5 sm:p-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-2xl font-medium tracking-[0.015em] text-foreground">
                        How others see you
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Your handle and avatar across every circle.
                    </p>
                </div>

                <AvatarField displayName={displayName} avatarUrl={avatarUrl} />

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
                        onChange={(e) => {
                            onChange(e.target.value);
                            setSaved(false);
                            setFormError(null);
                        }}
                        autoComplete="nickname"
                        maxLength={32}
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
                    disabled={isSubmitting || !dirty}
                    className="mt-1 self-start"
                >
                    <span aria-hidden>▸</span>
                    <span>{isSubmitting ? "saving" : "save identity"}</span>
                </Button>
            </form>
        </section>
    );
}

interface ProfileCardProps {
    firstName: string;
    middleName: string;
    lastName: string;
    initialFirstName: string;
    initialMiddleName: string;
    initialLastName: string;
    onChange: (next: { firstName: string; middleName: string; lastName: string }) => void;
}

function ProfileCard({
    firstName,
    middleName,
    lastName,
    initialFirstName,
    initialMiddleName,
    initialLastName,
    onChange,
}: ProfileCardProps) {
    const [commitProfile, isSubmitting] =
        useMutation<settingsProfileMutation>(UpdateProfileMutation);
    const [formError, setFormError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const dirty =
        firstName.trim() !== initialFirstName.trim() ||
        middleName.trim() !== initialMiddleName.trim() ||
        lastName.trim() !== initialLastName.trim();

    const fallbackError = "Could not save changes. Please try again.";

    const onSubmit = () => {
        setFormError(null);
        setSaved(false);

        if (!dirty) {
            setSaved(true);
            return;
        }

        const validation = validateUpdateProfileInput({ firstName, middleName, lastName });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        commitProfile({
            variables: { input: validation.data },
            onCompleted: (response) => {
                const payload = response.updateUserProfile;
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
        <section className="flex flex-col gap-4">
            <SectionLabel>profile</SectionLabel>
            <form
                className="surface-card flex flex-col gap-5 p-5 sm:p-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-2xl font-medium tracking-[0.015em] text-foreground">
                        So your friends know who you actually are
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Revealed on hover behind your display name. Not shown to strangers.
                    </p>
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
                        onChange={(e) => {
                            onChange({ firstName: e.target.value, middleName, lastName });
                            setSaved(false);
                            setFormError(null);
                        }}
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
                        onChange={(e) => {
                            onChange({ firstName, middleName: e.target.value, lastName });
                            setSaved(false);
                            setFormError(null);
                        }}
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
                        onChange={(e) => {
                            onChange({ firstName, middleName, lastName: e.target.value });
                            setSaved(false);
                            setFormError(null);
                        }}
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
                    disabled={isSubmitting || !dirty}
                    className="mt-1 self-start"
                >
                    <span aria-hidden>▸</span>
                    <span>{isSubmitting ? "saving" : "save profile"}</span>
                </Button>
            </form>
        </section>
    );
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(SettingsPageQuery, loaderData.queryRef);

    const initialDisplayName = data.me?.displayName ?? "";
    const initialFirstName = data.me?.profile?.firstName ?? "";
    const initialMiddleName = data.me?.profile?.middleName ?? "";
    const initialLastName = data.me?.profile?.lastName ?? "";

    const [displayName, setDisplayName] = useState(initialDisplayName);
    const [firstName, setFirstName] = useState(initialFirstName);
    const [middleName, setMiddleName] = useState(initialMiddleName);
    const [lastName, setLastName] = useState(initialLastName);

    return (
        <main className="container mx-auto flex flex-col px-4 py-10 sm:py-14">
            <Breadcrumb segments={[{ label: "settings" }]} />

            <h1 className="mt-6 font-heading text-4xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                Settings
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <IdentityCard
                    displayName={displayName}
                    initialDisplayName={initialDisplayName}
                    avatarUrl={data.me?.avatarUrl}
                    onChange={setDisplayName}
                />
                <ProfileCard
                    firstName={firstName}
                    middleName={middleName}
                    lastName={lastName}
                    initialFirstName={initialFirstName}
                    initialMiddleName={initialMiddleName}
                    initialLastName={initialLastName}
                    onChange={(next) => {
                        setFirstName(next.firstName);
                        setMiddleName(next.middleName);
                        setLastName(next.lastName);
                    }}
                />
            </div>
        </main>
    );
}
