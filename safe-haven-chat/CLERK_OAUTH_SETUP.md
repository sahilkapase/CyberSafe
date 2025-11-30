# Enabling Google and Facebook OAuth in Clerk

Follow these steps to enable social sign-in providers in your Clerk application:

## Step 1: Access Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application (or create a new one if needed)

## Step 2: Enable Google OAuth

1. In the left sidebar, click on **"User & Authentication"** 
2. Click on **"Social connections"** or **"SSO Connections"**
3. Find **Google** in the list of providers
4. Click **"Enable"** or the toggle switch
5. Clerk provides default OAuth credentials for testing, but for production you'll need to:
   - Create a Google Cloud project
   - Enable Google OAuth
   - Add your OAuth credentials

**For Development:**
- Clerk provides built-in OAuth credentials for testing
- Just toggle Google on and it will work immediately!

## Step 3: Enable Facebook OAuth

1. In the same **"Social connections"** section
2. Find **Facebook** in the list of providers
3. Click **"Enable"** or the toggle switch
4. Similar to Google, Clerk provides test credentials for development
5. For production, you'll need:
   - A Facebook Developer account
   - Create a Facebook App
   - Add your Facebook App ID and Secret

**For Development:**
- Clerk provides built-in OAuth credentials for testing
- Just toggle Facebook on and it will work immediately!

## Step 4: Configure Additional Settings (Optional)

1. **Customize the appearance:** You can customize buttons, colors, and branding
2. **Set redirect URLs:** Configure where users land after signing in
3. **Enable additional providers:** GitHub, Microsoft, LinkedIn, etc.

## Step 5: Test Your Integration

1. Go to http://localhost:8080/
2. Click **"Get Started"** or **"Sign In"**
3. You should see options for:
   - Email sign-up
   - Google sign-in
   - Facebook sign-in
4. Try signing up with Google or Facebook to verify it works!

## Quick Links

- [Clerk Dashboard - Social Connections](https://dashboard.clerk.com/last-active?path=user-authentication/social-connections)
- [Clerk OAuth Documentation](https://clerk.com/docs/authentication/social-connections/overview)
- [Google OAuth Setup Guide](https://clerk.com/docs/authentication/social-connections/google)
- [Facebook OAuth Setup Guide](https://clerk.com/docs/authentication/social-connections/facebook)

## Note

The OAuth buttons will automatically appear in the Clerk modal when you enable the providers in the dashboard. No additional code changes are needed!
