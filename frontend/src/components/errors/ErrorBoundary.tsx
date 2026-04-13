"use client";

import React, { Component, ReactNode } from "react";
import { FatalError } from "./FatalError";

interface Props {
    children: ReactNode;
    fallback?: (error: Error) => ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to monitoring service
        if (process.env.NODE_ENV === "production") {
            // Add your error reporting service here
            console.error("Error caught by boundary:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error);
            }
            return <FatalError error={this.state.error} />;
        }

        return this.props.children;
    }
}
