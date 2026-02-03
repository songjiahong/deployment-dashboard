# Bitbucket Deployment Dashboard

A modern web application for managing and monitoring Bitbucket deployments with OAuth authentication.

## Features

- 🔐 **Bitbucket OAuth Authentication** - Secure login with Bitbucket credentials
- 📊 **Dashboard Overview** - View all projects and repositories in one place
- 🎯 **Project Management** - Add or remove projects/repositories from the dashboard
- 📈 **Deployment Status** - Monitor deployment status grouped by project
- 🚀 **Manual Deployments** - Trigger deployments directly from the dashboard
- 🔄 **Real-time Updates** - Refresh deployment status on demand
- 🎨 **Modern UI** - Built with Next.js, React, TypeScript, and TailwindCSS

## Prerequisites

- Node.js 18+ and npm/yarn
- A Bitbucket account
- Bitbucket OAuth Consumer credentials

## Setup Instructions

### Standard Setup (OAuth - Recommended)

With OAuth, **users simply sign in with their Bitbucket accounts** - no manual token creation needed!

**You (as the app owner) only need to set up OAuth once:**

#### 1. Create Bitbucket OAuth Consumer (One-Time Setup)

1. Go to your Bitbucket workspace settings
2. Navigate to **OAuth consumers** under **Apps and features**
3. Click **Add consumer**
4. Fill in the details:
   - **Name**: Bitbucket Deployment Dashboard
   - **Callback URL**: `http://localhost:3000/api/auth/callback/bitbucket`
   - **Permissions**: Select the following:
     - Account: Read
     - Repositories: Read
     - Pipelines: Read
5. Save and note down the **Key** (Client ID) and **Secret** (Client Secret)

> **Note:** You only create this OAuth consumer once. After that, any user can sign in with their Bitbucket account - they don't need to create any tokens!

#### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your OAuth credentials:
```env
BITBUCKET_CLIENT_ID=your_client_id_from_step_1
BITBUCKET_CLIENT_SECRET=your_client_secret_from_step_1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_command_below
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Click **Sign in with Bitbucket** on the login page
2. Authorize the application to access your Bitbucket account (first time only)
3. You'll be redirected to the dashboard

**That's it!** Each user just signs in with their Bitbucket credentials - no token creation needed.

---

## Advanced: API Token Mode (Optional)

If you prefer to bypass user login and use a fixed API token instead:

### Setup for API Token Mode

1. **Create a Bitbucket App Password:**
   - Go to [Bitbucket Account Settings](https://bitbucket.org/account/settings/app-passwords/)
   - Create new app password with required permissions
   - Copy the generated password

2. **Update `.env`:**
   ```env
   AUTH_METHOD=token
   BITBUCKET_API_TOKEN=your_app_password
   BITBUCKET_USERNAME=your_username
   BITBUCKET_WORKSPACE=your_workspace_slug
   ```

This mode is useful for automated deployments or single-user scenarios where you don't want a login screen.

---

## Using the Dashboard

### Managing Projects

- **View Projects**: All projects in your workspace are displayed by default
- **Add/Remove Projects**: Click on project buttons to toggle their visibility
- **Select Workspace**: Use the dropdown to switch between workspaces

### Monitoring Deployments

The dashboard displays a table for each project showing:
- Repository name and slug
- Latest pipeline build number and branch
- Latest deployment environment and date
- Current deployment status with color-coded badges
- Quick action buttons

### Triggering Deployments

1. Locate the repository you want to deploy
2. Click the **Deploy** button in the Actions column
3. The system will trigger a pipeline on the main branch
4. Refresh the dashboard to see updated status

### Status Indicators

- 🟢 **Green (Success)**: Deployment completed successfully
- 🔴 **Red (Failed)**: Deployment failed or encountered an error
- 🟡 **Yellow (In Progress)**: Deployment is currently running
- ⚪ **Gray (Unknown)**: No status available

## Project Structure

```
bitbucket-deployment-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   └── bitbucket/              # Bitbucket API routes
│   ├── auth/signin/                # Sign-in page
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── providers.tsx               # Session provider
├── components/
│   ├── ui/                         # Reusable UI components
│   └── DeploymentDashboard.tsx     # Main dashboard component
├── lib/
│   ├── bitbucket.ts                # Bitbucket API client
│   └── utils.ts                    # Utility functions
├── types/
│   ├── bitbucket.ts                # Bitbucket type definitions
│   └── next-auth.d.ts              # NextAuth type extensions
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies
└── README.md                       # This file
```

## API Routes

- `GET /api/bitbucket/workspaces` - Fetch all workspaces
- `GET /api/bitbucket/projects?workspace={workspace}` - Fetch projects
- `GET /api/bitbucket/repositories?workspace={workspace}&projectKey={key}` - Fetch repositories
- `GET /api/bitbucket/deployments?workspace={workspace}&repoSlug={slug}` - Fetch deployments
- `POST /api/bitbucket/deployments` - Trigger a deployment
- `GET /api/bitbucket/pipelines?workspace={workspace}&repoSlug={slug}` - Fetch pipelines
- `POST /api/bitbucket/pipelines` - Trigger a pipeline

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **NextAuth.js** - Authentication
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Bitbucket API 2.0** - Data source

## Troubleshooting

### Authentication Issues

**For API Token Method:**
- Verify your app password is correct and hasn't expired
- Ensure your username is correct (not email)
- Check that all required permissions were granted when creating the app password
- Verify the workspace slug is correct

**For OAuth Method:**
- Verify your OAuth consumer credentials are correct
- Ensure the callback URL matches exactly: `http://localhost:3000/api/auth/callback/bitbucket`
- Check that all required permissions are granted

### API Errors

- Confirm your Bitbucket account has access to the repositories
- Verify the workspace slug is correct
- Check browser console for detailed error messages

### Deployment Triggers Not Working

- Ensure Bitbucket Pipelines are enabled for the repository
- Verify you have write permissions for the repository
- Check that the repository has a `bitbucket-pipelines.yml` file

## Production Deployment

1. Update `NEXTAUTH_URL` in `.env` to your production URL
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```
4. Update the Bitbucket OAuth callback URL to match your production domain

## License

MIT

## Support

For issues or questions, please refer to the Bitbucket API documentation:
- [Bitbucket API 2.0](https://developer.atlassian.com/cloud/bitbucket/rest/intro/)
- [Bitbucket Deployments API](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-deployments/)
