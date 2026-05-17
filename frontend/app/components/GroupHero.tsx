import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/react-router";
import {
    fetchQuery,
    graphql,
    useFragment,
    useMutation,
    useRelayEnvironment,
} from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { useNavigate } from "react-router";
import { UserPlusIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { GroupHero_group$key } from "@/__generated__/GroupHero_group.graphql";
import type { GroupHeroUpdateMutation } from "@/__generated__/GroupHeroUpdateMutation.graphql";
import type { GroupHeroTransferAdminMutation } from "@/__generated__/GroupHeroTransferAdminMutation.graphql";
import type { GroupHeroDeleteMutation } from "@/__generated__/GroupHeroDeleteMutation.graphql";
import type { GroupHeroClearImageMutation } from "@/__generated__/GroupHeroClearImageMutation.graphql";
import type { GroupHeroImageRefreshQuery } from "@/__generated__/GroupHeroImageRefreshQuery.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DrawerDialog } from "@/components/DrawerDialog";
import { GroupImage } from "@/components/GroupImage";
import {
    ImageUploadField,
    useImageUploadFieldStatus,
} from "@/components/ImageUploadField";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";
import { validateUpdateGroupInput } from "@/lib/validation/forms";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { uploadGroupImage } from "@/lib/uploadImage";
import { preloadImage } from "@/lib/preloadImage";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

const GroupHeroFragment = graphql`
    fragment GroupHero_group on Group {
        id
        databaseId
        name
        description
        createdDate
        imageUrl(size: 256)
        admin {
            id
            displayName
        }
        transferableMembers: members(first: 100) {
            edges {
                node {
                    id
                    displayName
                }
            }
        }
    }
`;

const ImageRefreshQuery = graphql`
    query GroupHeroImageRefreshQuery($id: ID!) {
        groupById(id: $id) {
            id
            imageUrl(size: 256)
        }
    }
`;

const UpdateGroupMutation = graphql`
    mutation GroupHeroUpdateMutation($input: UpdateGroupInput!) {
        updateGroup(input: $input) {
            group {
                id
                name
                description
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

const TransferGroupAdminMutation = graphql`
    mutation GroupHeroTransferAdminMutation($input: TransferGroupAdminInput!) {
        transferGroupAdmin(input: $input) {
            group {
                id
                admin {
                    id
                    displayName
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

const DeleteGroupMutation = graphql`
    mutation GroupHeroDeleteMutation($input: DeleteGroupInput!, $connections: [ID!]!) {
        deleteGroup(input: $input) {
            deletedGroupPayload {
                deletedId @deleteEdge(connections: $connections)
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

const ClearGroupImageMutation = graphql`
    mutation GroupHeroClearImageMutation($input: ClearGroupImageInput!) {
        clearGroupImage(input: $input) {
            group {
                id
                imageUrl(size: 256)
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

function GroupImageFieldDisplay({
    name,
    imageUrl,
}: {
    name: string;
    imageUrl: string | null | undefined;
}) {
    const { busy } = useImageUploadFieldStatus();
    return <GroupImage name={name} imageUrl={imageUrl} size="field" loading={busy} />;
}

interface GroupHeroProps {
    group: GroupHero_group$key;
    memberCount: number;
    awardCount: number;
    gamesTotalCount: number;
    isAdmin: boolean;
    currentUserId?: string | null;
    onInvite: () => void;
}

export function GroupHero({
    group,
    memberCount,
    awardCount,
    gamesTotalCount,
    isAdmin,
    currentUserId,
    onInvite,
}: GroupHeroProps) {
    const data = useFragment(GroupHeroFragment, group);
    const navigate = useNavigate();
    const environment = useRelayEnvironment();
    const { getToken } = useAuth();

    const [settingsOpen, setSettingsOpen] = useState(false);

    const [commitUpdate, isUpdating] = useMutation<GroupHeroUpdateMutation>(UpdateGroupMutation);
    const [commitTransfer, isTransferring] =
        useMutation<GroupHeroTransferAdminMutation>(TransferGroupAdminMutation);
    const [commitDelete, isDeleting] = useMutation<GroupHeroDeleteMutation>(DeleteGroupMutation);
    const [commitClearImage] =
        useMutation<GroupHeroClearImageMutation>(ClearGroupImageMutation);

    const [editName, setEditName] = useState(data.name);
    const [editDescription, setEditDescription] = useState(data.description ?? "");
    const [editError, setEditError] = useState<string | null>(null);
    const [editSaved, setEditSaved] = useState(false);

    useEffect(() => {
        setEditName(data.name);
        setEditDescription(data.description ?? "");
    }, [data.name, data.description]);

    const otherMembers = useMemo(
        () =>
            data.transferableMembers?.edges
                ?.map((edge) => edge?.node)
                .filter(
                    (node): node is { id: string; displayName: string } =>
                        node != null && node.id !== currentUserId
                ) ?? [],
        [data.transferableMembers, currentUserId]
    );

    const [transferTargetId, setTransferTargetId] = useState<string>("");
    const [transferConfirmOpen, setTransferConfirmOpen] = useState(false);
    const [transferError, setTransferError] = useState<string | null>(null);
    const transferTarget = otherMembers.find((m) => m.id === transferTargetId) ?? null;

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const hasImage = data.imageUrl != null;
    const handleUploadGroupImage = async (file: File) => {
        await uploadGroupImage(data.databaseId, file, () => getToken());
        try {
            const result = await fetchQuery<GroupHeroImageRefreshQuery>(
                environment,
                ImageRefreshQuery,
                { id: data.id }
            ).toPromise();
            const nextUrl = result?.groupById?.imageUrl ?? null;
            if (nextUrl) {
                await preloadImage(nextUrl);
            }
        } catch (err) {
            console.error("Group refetch failed after upload", err);
        }
    };

    const handleRemoveGroupImage = () =>
        new Promise<void>((resolve, reject) => {
            commitClearImage({
                variables: { input: { groupId: data.id } },
                onCompleted: (response) => {
                    const payload = response.clearGroupImage;
                    if (!payload?.group) {
                        reject(
                            new Error(
                                getMutationErrorMessage(
                                    payload?.errors,
                                    "Could not remove image."
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
                            getMutationNetworkErrorMessage(err, "Could not remove image.")
                        )
                    );
                },
            });
        });

    const isDirty =
        editName.trim() !== data.name ||
        (editDescription.trim() || null) !== (data.description ?? null);

    const handleSaveEdit = (event: React.FormEvent) => {
        event.preventDefault();
        setEditError(null);
        setEditSaved(false);
        const validation = validateUpdateGroupInput({
            groupId: data.id,
            name: editName,
            description: editDescription,
        });
        if (!validation.success) {
            setEditError(validation.error);
            return;
        }
        commitUpdate({
            variables: { input: validation.data },
            onCompleted: (response) => {
                const payload = response.updateGroup;
                if (payload?.group?.id) {
                    setEditSaved(true);
                    return;
                }
                setEditError(
                    getMutationErrorMessage(payload?.errors, "Could not update circle.")
                );
            },
            onError: (error) => {
                setEditError(
                    getMutationNetworkErrorMessage(error, "Could not update circle.")
                );
            },
        });
    };

    const handleConfirmTransfer = () => {
        if (!transferTarget) return;
        setTransferError(null);
        commitTransfer({
            variables: {
                input: { groupId: data.id, newAdminId: transferTarget.id },
            },
            onCompleted: (response) => {
                const payload = response.transferGroupAdmin;
                if (payload?.group?.admin?.id) {
                    setTransferConfirmOpen(false);
                    setTransferTargetId("");
                    setSettingsOpen(false);
                    return;
                }
                setTransferError(
                    getMutationErrorMessage(payload?.errors, "Could not transfer admin.")
                );
            },
            onError: (error) => {
                setTransferError(
                    getMutationNetworkErrorMessage(error, "Could not transfer admin.")
                );
            },
        });
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmName !== data.name) return;
        setDeleteError(null);
        const connections = currentUserId
            ? [ConnectionHandler.getConnectionID(currentUserId, "Groups_groups")]
            : [];
        commitDelete({
            variables: {
                input: { groupId: data.id, confirmName: deleteConfirmName },
                connections,
            },
            onCompleted: (response) => {
                const payload = response.deleteGroup;
                if (payload?.deletedGroupPayload?.deletedId) {
                    navigate("/groups");
                    return;
                }
                setDeleteError(
                    getMutationErrorMessage(payload?.errors, "Could not delete circle.")
                );
            },
            onError: (error) => {
                setDeleteError(
                    getMutationNetworkErrorMessage(error, "Could not delete circle.")
                );
            },
        });
    };

    const deleteConfirmMatches = deleteConfirmName === data.name;
    const settingsBusy = isUpdating || isTransferring || isDeleting;

    return (
        <section className="flex flex-col gap-6">
            <Breadcrumb segments={[{ label: "groups", href: "/groups" }, { label: data.name }]} />

            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 sm:gap-6">
                    <GroupImage
                        name={data.name}
                        imageUrl={data.imageUrl}
                        size="hero"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h1 className="font-heading text-4xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                                {data.name}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Circle settings"
                                onClick={() => setSettingsOpen(true)}
                                className="text-muted-foreground/50 hover:text-foreground"
                            >
                                <Cog6ToothIcon />
                            </Button>
                        </div>
                        {data.description ? (
                            <p className="max-w-2xl font-heading text-lg leading-relaxed tracking-[0.015em] text-foreground/85">
                                &ldquo;{data.description}&rdquo;
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <AwardTrophyButton
                        preselectedGameId={null}
                        groupId={data.id}
                        currentUserId={currentUserId}
                        otherMemberCount={Math.max(0, memberCount - 1)}
                        variant="gold"
                        size="terminal"
                        label="Award trophy"
                    />
                    {isAdmin ? (
                        <Button
                            variant="outline"
                            size="terminal"
                            leadingIcon={<UserPlusIcon />}
                            onClick={onInvite}
                        >
                            Invite
                        </Button>
                    ) : null}
                </div>
            </div>

            <Drawer
                direction="right"
                open={settingsOpen}
                onOpenChange={(open) => {
                    if (settingsBusy) return;
                    setSettingsOpen(open);
                }}
            >
                <DrawerContent>
                    <DrawerHeader className="flex flex-row items-center justify-between">
                        <DrawerTitle>{data.name}</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Close">
                                <XMarkIcon />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto p-4 pt-2">
                        <ImageUploadField
                            hasImage={hasImage}
                            onUpload={handleUploadGroupImage}
                            onRemove={handleRemoveGroupImage}
                            confirmRemove={{
                                title: "Remove circle image?",
                                description:
                                    "The circle's initial will be shown instead. Any member can upload a new image.",
                                confirmLabel: "Remove image",
                            }}
                            className="border-b border-border/40 pb-6"
                        >
                            <div className="flex items-center gap-4">
                                <ImageUploadField.Display>
                                    <GroupImageFieldDisplay
                                        name={data.name}
                                        imageUrl={data.imageUrl}
                                    />
                                </ImageUploadField.Display>
                                <div className="flex flex-col gap-2">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                        image
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <ImageUploadField.UploadTrigger />
                                        <ImageUploadField.RemoveTrigger />
                                    </div>
                                </div>
                            </div>
                            <ImageUploadField.Error />
                        </ImageUploadField>

                        {isAdmin ? (
                            <form
                                onSubmit={handleSaveEdit}
                                className="flex flex-col gap-4 border-b border-border/40 py-6"
                            >
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="group-edit-name">Name</Label>
                                    <Input
                                        id="group-edit-name"
                                        value={editName}
                                        onChange={(event) => {
                                            setEditName(event.target.value);
                                            setEditSaved(false);
                                            setEditError(null);
                                        }}
                                        disabled={isUpdating}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="group-edit-description">Description</Label>
                                    <Textarea
                                        id="group-edit-description"
                                        rows={3}
                                        value={editDescription}
                                        onChange={(event) => {
                                            setEditDescription(event.target.value);
                                            setEditSaved(false);
                                            setEditError(null);
                                        }}
                                        disabled={isUpdating}
                                    />
                                </div>
                                {editError ? (
                                    <p className="text-sm text-destructive">{editError}</p>
                                ) : null}
                                <div className="flex items-center justify-between gap-3">
                                    {editSaved ? (
                                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-medal-gold">
                                            <span aria-hidden className="mr-2">
                                                ✓
                                            </span>
                                            Saved
                                        </p>
                                    ) : (
                                        <span />
                                    )}
                                    <Button
                                        type="submit"
                                        size="sm"
                                        busy={isUpdating}
                                        disabled={isUpdating || !isDirty}
                                    >
                                        Save changes
                                    </Button>
                                </div>
                            </form>
                        ) : null}

                        <dl className="flex flex-col gap-4 pt-6 font-mono text-[11px] uppercase tracking-[0.22em]">
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">founded</dt>
                                <dd
                                    className="text-foreground/85"
                                    title={formatAbsoluteDateTime(data.createdDate)}
                                >
                                    {formatRelativeTime(data.createdDate)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">souls</dt>
                                <dd className="text-foreground/85">{memberCount}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">awards</dt>
                                <dd className="text-foreground/85">{awardCount}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-muted-foreground/70">games</dt>
                                <dd className="text-foreground/85">{gamesTotalCount}</dd>
                            </div>
                        </dl>

                        {isAdmin ? (
                            <div className="mt-8 flex flex-col gap-5 border border-destructive/30 p-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-destructive/85">
                                    danger zone
                                </p>

                                <div className="flex flex-col gap-3">
                                    <Label
                                        htmlFor="group-transfer-target"
                                        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70"
                                    >
                                        hand over admin
                                    </Label>
                                    {otherMembers.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No other members to promote.
                                        </p>
                                    ) : (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <Select
                                                value={transferTargetId}
                                                onValueChange={setTransferTargetId}
                                                disabled={settingsBusy}
                                            >
                                                <SelectTrigger
                                                    id="group-transfer-target"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Pick a member" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {otherMembers.map((member) => (
                                                        <SelectItem
                                                            key={member.id}
                                                            value={member.id}
                                                        >
                                                            {member.displayName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={!transferTargetId || settingsBusy}
                                                onClick={() => {
                                                    setTransferError(null);
                                                    setTransferConfirmOpen(true);
                                                }}
                                            >
                                                Transfer
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
                                        delete circle
                                    </p>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        disabled={settingsBusy}
                                        onClick={() => {
                                            setDeleteConfirmName("");
                                            setDeleteError(null);
                                            setDeleteConfirmOpen(true);
                                        }}
                                    >
                                        Delete {data.name}…
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </DrawerContent>
            </Drawer>

            <DrawerDialog
                open={transferConfirmOpen}
                onOpenChange={(next) => {
                    if (isTransferring) return;
                    setTransferConfirmOpen(next);
                    if (!next) setTransferError(null);
                }}
                title={`Hand over ${data.name}?`}
                description={
                    transferTarget
                        ? `${transferTarget.displayName} will become the admin. You will stay as a regular member.`
                        : undefined
                }
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isTransferring}
                            onClick={() => setTransferConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            busy={isTransferring}
                            disabled={isTransferring || !transferTarget}
                            onClick={handleConfirmTransfer}
                        >
                            Transfer admin
                        </Button>
                    </div>
                }
            >
                {transferError ? (
                    <p className="text-sm text-destructive">{transferError}</p>
                ) : null}
            </DrawerDialog>

            <DrawerDialog
                open={deleteConfirmOpen}
                onOpenChange={(next) => {
                    if (isDeleting) return;
                    setDeleteConfirmOpen(next);
                    if (!next) {
                        setDeleteConfirmName("");
                        setDeleteError(null);
                    }
                }}
                title={`Delete ${data.name}?`}
                description="All games, trophies, requests, and invites will be permanently deleted. This cannot be undone."
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isDeleting}
                            onClick={() => setDeleteConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            busy={isDeleting}
                            disabled={isDeleting || !deleteConfirmMatches}
                            onClick={handleConfirmDelete}
                        >
                            Delete {data.name} forever
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-3">
                    <Label htmlFor="group-delete-confirm">
                        Type{" "}
                        <span className="font-mono text-foreground">{data.name}</span> to confirm.
                    </Label>
                    <Input
                        id="group-delete-confirm"
                        value={deleteConfirmName}
                        onChange={(event) => setDeleteConfirmName(event.target.value)}
                        disabled={isDeleting}
                        autoComplete="off"
                    />
                    {deleteError ? (
                        <p className="text-sm text-destructive">{deleteError}</p>
                    ) : null}
                </div>
            </DrawerDialog>
        </section>
    );
}
