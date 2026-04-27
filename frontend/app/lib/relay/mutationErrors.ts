type MutationError = {
    readonly __typename: string;
    readonly message?: string | null;
};

export function getMutationErrorMessage(
    errors: ReadonlyArray<MutationError> | null | undefined,
    fallback: string
) {
    return errors?.find((error) => Boolean(error.message))?.message ?? fallback;
}

export function getMutationNetworkErrorMessage(error: Error, fallback: string) {
    const message = error.message.trim();
    return message.length > 0 ? message : fallback;
}
