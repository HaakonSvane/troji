import { cn } from "@/lib/utils";
import { HTMLProps, PropsWithChildren, ReactNode } from "react";

type ContainerProps = {
    logo: ReactNode;
};

export const Container = ({
    logo,
    children,
    ...rest
}: PropsWithChildren<ContainerProps> & HTMLProps<HTMLDivElement>) => (
    <nav className={cn("sticky top-0 z-10", rest.className)}>
        <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-10">
            <div className="max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center space-x-8">
                    {logo}
                    <div className="flex flex-1 items-center">{children}</div>
                </div>
            </div>
        </div>
    </nav>
);
