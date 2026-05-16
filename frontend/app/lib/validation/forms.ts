import type { CreateGameInput } from "@/__generated__/NewGameFormMutation.graphql";
import type { CreateGroupInput } from "@/__generated__/NewGroupFormMutation.graphql";
import type { CreateTrophyRequestInput } from "@/__generated__/TrophyAwardJourneyMutation.graphql";
import type { RegisterUserInput } from "@/__generated__/registerUserMutation.graphql";
import type { UpdateUserDisplayNameInput } from "@/__generated__/settingsDisplayNameMutation.graphql";
import type { UpdateUserProfileInput } from "@/__generated__/settingsProfileMutation.graphql";
import type { GroupHeroUpdateMutation$variables } from "@/__generated__/GroupHeroUpdateMutation.graphql";
import { z } from "zod";

type UpdateGroupInput = GroupHeroUpdateMutation$variables["input"];

type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

const requiredText = (message: string) => z.string().trim().min(1, message);
const optionalText = z
    .string()
    .trim()
    .transform((value) => value || null);

const displayNameSchema = z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(32, "Display name must be at most 32 characters.");

const createGameInputSchema = z.object({
    groupId: requiredText("Group is required."),
    name: requiredText("Game name is required."),
    symbol: requiredText("Choose a symbol."),
    description: optionalText,
});

const createGroupInputSchema = z.object({
    name: requiredText("Group name is required."),
    description: optionalText,
});

const updateGroupInputSchema = z.object({
    groupId: requiredText("Group id is required."),
    name: requiredText("Group name is required."),
    description: optionalText,
});

const createTrophyRequestInputSchema = z.object({
    gameId: requiredText("Game is required."),
    userId: requiredText("Select a member to receive the trophy."),
    description: optionalText,
});

const updateDisplayNameInputSchema = z.object({
    displayName: displayNameSchema,
});

const profileNamesSchema = z.object({
    firstName: requiredText("First name is required."),
    middleName: optionalText,
    lastName: requiredText("Last name is required."),
});

const registerUserInputSchema = z.object({
    displayName: displayNameSchema,
    firstName: requiredText("First name is required."),
    middleName: optionalText,
    lastName: requiredText("Last name is required."),
});

function toValidationResult<T>(
    result: z.ZodSafeParseResult<T>,
    fallbackMessage: string
): ValidationResult<T> {
    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message ?? fallbackMessage,
        };
    }

    return { success: true, data: result.data };
}

export function validateCreateGameInput(values: {
    groupId: string;
    name: string;
    symbol: string;
    description: string;
}): ValidationResult<CreateGameInput> {
    return toValidationResult<CreateGameInput>(
        createGameInputSchema.safeParse(values),
        "Could not validate game details."
    );
}

export function validateCreateGroupInput(values: {
    name: string;
    description: string;
}): ValidationResult<CreateGroupInput> {
    return toValidationResult<CreateGroupInput>(
        createGroupInputSchema.safeParse(values),
        "Could not validate group details."
    );
}

export function validateUpdateGroupInput(values: {
    groupId: string;
    name: string;
    description: string;
}): ValidationResult<UpdateGroupInput> {
    return toValidationResult<UpdateGroupInput>(
        updateGroupInputSchema.safeParse(values),
        "Could not validate group details."
    );
}

export function validateCreateTrophyRequestInput(values: {
    gameId: string;
    userId: string;
    description: string;
}): ValidationResult<CreateTrophyRequestInput> {
    return toValidationResult<CreateTrophyRequestInput>(
        createTrophyRequestInputSchema.safeParse(values),
        "Could not validate trophy request details."
    );
}

export function validateUpdateDisplayNameInput(values: {
    displayName: string;
}): ValidationResult<UpdateUserDisplayNameInput> {
    return toValidationResult<UpdateUserDisplayNameInput>(
        updateDisplayNameInputSchema.safeParse(values),
        "Could not validate display name."
    );
}

export function validateUpdateProfileInput(values: {
    firstName: string;
    middleName: string;
    lastName: string;
}): ValidationResult<UpdateUserProfileInput> {
    return toValidationResult<UpdateUserProfileInput>(
        profileNamesSchema.safeParse(values),
        "Could not validate profile details."
    );
}

export function validateRegisterUserInput(values: {
    displayName: string;
    firstName: string;
    middleName: string;
    lastName: string;
}): ValidationResult<RegisterUserInput> {
    return toValidationResult<RegisterUserInput>(
        registerUserInputSchema.safeParse(values),
        "Could not validate registration details."
    );
}

const feedbackInputSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters.")
        .max(120, "Title must be at most 120 characters."),
    body: z
        .string()
        .trim()
        .min(20, "Feedback must be at least 20 characters.")
        .max(4000, "Feedback must be at most 4000 characters."),
});

export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export function validateFeedbackInput(values: {
    title: string;
    body: string;
}): ValidationResult<FeedbackInput> {
    return toValidationResult<FeedbackInput>(
        feedbackInputSchema.safeParse(values),
        "Could not validate feedback."
    );
}
