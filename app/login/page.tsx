
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-6 rounded-lg border p-6 shadow-sm">
                <div className="flex flex-col space-y-1 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>

                <form className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                    </div>
                    <Button formAction={login} className="w-full">
                        Sign In
                    </Button>
                    <Button formAction={signup} variant="outline" className="w-full">
                        Sign Up
                    </Button>

                </form>
            </div>
        </div>
    )
}
