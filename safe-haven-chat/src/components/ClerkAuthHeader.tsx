import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/clerk-react";

export default function ClerkAuthHeader() {
    return (
        <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
            <SignedOut>
                <SignInButton mode="modal">
                    <button style={{ marginRight: "1rem" }}>Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <button>Sign Up</button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </header>
    );
}
