import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LayoutDashboard } from 'lucide-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_your_key_here';

interface AuthButtonProps {
    text: string;
    link: string;
    authText?: string;
    authLink?: string;
    className?: string;
    children?: React.ReactNode;
}

const AuthCheck = ({ text, link, authText = "Go to Dashboard", authLink = "/chat", className, children }: AuthButtonProps) => {
    const { isSignedIn } = useUser();

    if (isSignedIn) {
        return (
            <Link to={authLink} className={className}>
                {children ? children : (
                    <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        {authText}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link to={link} className={className}>
            {children ? children : text}
        </Link>
    );
};

export const AuthButton = (props: AuthButtonProps) => {
    if (hasValidClerkKey) {
        return <AuthCheck {...props} />;
    }

    return (
        <Link to={props.link} className={props.className}>
            {props.children ? props.children : props.text}
        </Link>
    );
};
