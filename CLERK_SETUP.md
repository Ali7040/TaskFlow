# Clerk Authentication Setup Guide

## Overview
This guide walks you through setting up Clerk authentication for TaskFlow.

## Prerequisites
- Node.js and npm installed
- Next.js project set up (already done)
- A Clerk account (free tier available)

---

## Step 1: Install Clerk

The Clerk package has already been installed in this project:
```bash
npm install @clerk/nextjs
```

---

## Step 2: Get Clerk API Keys

1. **Create a Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up for a free account

2. **Create an Application**
   - Click "Add application"
   - Choose your application name (e.g., "TaskFlow")
   - Select authentication methods (Email, Google, GitHub, etc.)

3. **Get Your API Keys**
   - Go to "API Keys" in the Clerk dashboard
   - Copy the following keys:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

4. **Add Keys to `.env.local`**
   - Open the `.env.local` file in your project
   - Replace the placeholder values:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

---

## Step 3: Configure Authentication URLs

The following Clerk URLs are already configured in `.env.local`:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

These tell Clerk where to redirect users after authentication.

---

## Step 4: Project Structure

The following files have been created/modified:

### 1. **middleware.ts** (Root level)
   - Protects all routes by default
   - Allows public access to sign-in and sign-up pages
   - Configures route matching patterns

### 2. **app/layout.tsx**
   - Wraps the app with `<ClerkProvider>`
   - Adds `suppressHydrationWarning` to prevent React hydration errors
   - Maintains your existing font setup

### 3. **app/(auth)/sign-in/[[...sign-in]]/page.tsx**
   - Custom styled sign-in page
   - Uses Clerk's `<SignIn />` component
   - Matches your TaskFlow branding

### 4. **app/(auth)/sign-up/[[...sign-up]]/page.tsx**
   - Custom styled sign-up page
   - Uses Clerk's `<SignUp />` component
   - Matches your TaskFlow branding

### 5. **app/page.tsx** (Main page)
   - Added `useUser()` hook from Clerk
   - Added `<UserButton />` component for user profile
   - Prevents hydration errors with client-side checks
   - Shows loading state while authenticating

---

## Step 5: Test Authentication

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Navigate to `http://localhost:3001`
   - You should be redirected to the sign-in page

3. **Create an Account**
   - Click "Sign up" or go to `/sign-up`
   - Create an account using email or social auth

4. **Sign In**
   - Sign in with your credentials
   - You should be redirected to the main TaskFlow page

5. **Test User Button**
   - Click your profile avatar in the top-right
   - You should see options to manage your account and sign out

---

## Step 6: Clerk Dashboard Configuration

### Email Settings
1. Go to "Email & SMS" in Clerk dashboard
2. Configure email templates (optional)
3. Set up custom email domain (optional, paid feature)

### Social Authentication
1. Go to "Social Login" in Clerk dashboard
2. Enable providers (Google, GitHub, etc.)
3. Add OAuth credentials for each provider

### User Management
1. Go to "Users" to see registered users
2. Manage user roles and permissions
3. Block or delete users if needed

### Sessions
1. Configure session lifetime
2. Set up multi-session handling
3. Configure sign-out behavior

---

## Step 7: Customize Clerk Appearance (Optional)

You can customize Clerk's UI to match your brand:

```typescript
// In sign-in or sign-up pages
<SignIn 
  appearance={{
    elements: {
      rootBox: 'mx-auto',
      card: 'shadow-2xl rounded-2xl border-2 border-blue-100',
      headerTitle: 'text-2xl font-bold text-blue-600',
      formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    }
  }}
/>
```

---

## Step 8: Protect Individual Routes (Advanced)

If you want to make some routes public:

```typescript
// middleware.ts
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/landing',  // Add public routes here
  '/about',
  '/api/public(.*)',
]);
```

---

## Step 9: Use User Data in Your App

Access user information anywhere in your app:

```typescript
import { useUser } from '@clerk/nextjs';

export default function MyComponent() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

---

## Step 10: Server-Side Authentication

Use Clerk in API routes and server components:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Your protected logic here
  return Response.json({ data: 'Protected data' });
}
```

---

## Troubleshooting

### Issue: Hydration Errors
**Solution**: Already fixed with `suppressHydrationWarning` and client-side checks.

### Issue: Redirect Loop
**Solution**: Check that middleware patterns match your routes correctly.

### Issue: Keys Not Working
**Solution**: 
1. Verify keys in Clerk dashboard
2. Restart dev server after changing `.env.local`
3. Check for spaces or quotes around keys

### Issue: Sign-in Page Not Styling
**Solution**: Clerk components use their own styles. Use the `appearance` prop to customize.

---

## Next Steps

1. ✅ **Clerk Authentication** - Complete
2. 🔄 **Database Integration** - See `DATABASE_SETUP.md`
3. 📱 **Mobile Responsiveness** - Already implemented
4. 🚀 **Deploy to Vercel** - See deployment guide

---

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk API Reference](https://clerk.com/docs/references/nextjs/overview)

---

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive keys
3. **Enable MFA** in Clerk dashboard for better security
4. **Set up rate limiting** for production
5. **Configure allowed redirect URLs** in Clerk dashboard

---

## Clerk Features to Explore

- **Organizations**: Multi-tenant support
- **Roles & Permissions**: RBAC implementation
- **Webhooks**: Sync user data to your database
- **Custom Claims**: Add metadata to user tokens
- **Magic Links**: Passwordless authentication
- **Multi-factor Authentication**: Enhanced security
