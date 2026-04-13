"use client";
import { cn } from "@/lib/utils";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { LogOut, MessageSquarePlus, User } from "lucide-react";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { toast } from "sonner";
import {
    DrawerDialog,
    DrawerDialogBody,
    DrawerDialogContent,
    DrawerDialogDescription,
    DrawerDialogHeader,
    DrawerDialogTitle,
    DrawerDialogTrigger,
} from "../ui/drawerDialog";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { NewFeedbackForm } from "./NewFeedbackForm";
import { UserMenuContentFragment$key } from "@/__generated__/UserMenuContentFragment.graphql";
import Link from "next/link";

const UserMenuFragment = graphql`
    fragment UserMenuContentFragment on User {
        username
        userProfile {
            firstName
            lastName
        }
    }
`;

type UserMenuContentProps = { fragmentKey: UserMenuContentFragment$key };

export const UserMenuContent = ({ fragmentKey }: UserMenuContentProps) => {
    const data = useFragment(UserMenuFragment, fragmentKey);
    const name: Name | undefined = data.userProfile ? new Name(data.userProfile) : undefined;
    const [isShowingFeedbackForm, setIsShowingFeedbackForm] = useState(false);

    const onCreateNewGameSuccess = () => {
        toast.success("Feedback submitted! Thank you!");
        setIsShowingFeedbackForm(false);
    };
    const onCreateNewGameError = (error: Error) => {
        toast.error("Failed to submit feedback. Got error: " + error.message);
        setIsShowingFeedbackForm(false);
    };

    return (
        <DrawerDialog open={isShowingFeedbackForm} onOpenChange={setIsShowingFeedbackForm}>
            <DropdownMenuContent>
                <DropdownMenuArrow />
                <DropdownMenuLabel>{name?.fullName ?? data.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className={cn("mr-4")} />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={cn("text-destructive")} asChild>
                        <Link href="/api/auth/logout">
                            <LogOut className={cn("mr-4")} />
                            <span>Sign out</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DrawerDialogTrigger asChild>
                        <DropdownMenuItem>
                            <MessageSquarePlus className={cn("mr-4")} />
                            <span>Provide feedback</span>
                        </DropdownMenuItem>
                    </DrawerDialogTrigger>
                </DropdownMenuGroup>
            </DropdownMenuContent>
            <DrawerDialogContent>
                <DrawerDialogHeader>
                    <DrawerDialogTitle>Leave some feedback</DrawerDialogTitle>
                    <DrawerDialogDescription>
                        {
                            "Thank you for wanting to provide some feedback. Don't let anything stop you from sharing your thoughts, be it praise, complaints or suggestions!"
                        }
                    </DrawerDialogDescription>
                </DrawerDialogHeader>
                <DrawerDialogBody>
                    <NewFeedbackForm
                        onSuccess={onCreateNewGameSuccess}
                        onError={onCreateNewGameError}
                    />
                </DrawerDialogBody>
            </DrawerDialogContent>
        </DrawerDialog>
    );
};
