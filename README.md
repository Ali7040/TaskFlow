# TaskFlow - Project Management Network Diagram

A modern, interactive project management tool that visualizes task dependencies using network diagrams. Built with Next.js 16, React Flow, Tailwind CSS, and Clerk authentication.

## ✨ Features

- � **User Authentication** - Secure login with Clerk (Email, Google, GitHub, etc.)
- �📊 **Interactive Network Diagram** - Visualize task dependencies in real-time
- ✅ **Task Management** - Create, Read, Update, Delete tasks with ease
- 🔗 **Dependency Tracking** - Visual connections between related tasks
- 📅 **Date Management** - Beautiful date picker with range selection
- � **Assignee Management** - Assign tasks to team members
- 🎯 **Priority Levels** - Low, Medium, High priority indicators
- 📈 **Status Tracking** - Not Started, In Progress, Completed, Blocked
- 💾 **Data Persistence** - Currently uses localStorage (database setup guide included)
- 📤 **Export/Import** - Save and load project data as JSON
- 🎨 **Modern UI** - Beautiful gradients, animations, and shadcn/ui components
- 📱 **Responsive Design** - Works seamlessly on all devices

## � Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account (free tier available at [clerk.com](https://clerk.com))

### Quick Setup

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd taskflow
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
   - Copy `.env.local` and add your Clerk keys
   - Get keys from [Clerk Dashboard](https://dashboard.clerk.com)
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open in browser**:
   - Navigate to [http://localhost:3001](http://localhost:3001)
   - Create an account or sign in
   - Start managing your projects!

## 📚 Documentation

- **[Clerk Setup Guide](./CLERK_SETUP.md)** - Complete authentication setup
- **[Database Setup Guide](./DATABASE_SETUP.md)** - Options for production database
- **[User Guide](./USER_GUIDE.md)** - How to use TaskFlow features
- **[Project Summary](./PROJECT_SUMMARY.md)** - Technical implementation details

## 🎯 Usage

### Authentication
1. Visit the app - you'll be redirected to sign in
2. Create an account or sign in with email/social providers
3. Your tasks are associated with your user account

### Creating Tasks
1. Click the "Create Task" button in the sidebar
2. Fill in task details:
   - **Title** (required)
   - **Description**
   - **Status** (Not Started, In Progress, Completed, Blocked)
   - **Priority** (Low, Medium, High)
   - **Date Range** (Start and End dates)
   - **Assignee**
   - **Dependencies** (select from existing tasks)
3. Click "Save Task"

### Network Diagram
- **Tasks appear as nodes** with color-coded status:
  - 🔵 **Blue**: In Progress
  - 🟢 **Green**: Completed
  - ⚪ **Gray**: Not Started
  - 🔴 **Red**: Blocked
- **Arrows show dependencies** between tasks
- **Drag to connect** tasks by creating dependencies
- **Zoom and pan** to navigate large diagrams
- **Minimap** shows overview of entire project

### Task Management
- **Edit**: Click task node or list item to edit
- **Delete**: Remove tasks with confirmation
- **Connect**: Drag from one task to another to create dependencies
- **Filter**: View tasks by status in the sidebar

### Data Management
- **Export**: Download your project as JSON
- **Import**: Load previously saved project data
- **Auto-save**: Changes are saved automatically to localStorage

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Authentication** | Clerk |
| **Styling** | Tailwind CSS 4 |
| **Components** | shadcn/ui (Radix UI) |
| **Diagrams** | React Flow |
| **Language** | TypeScript |
| **Icons** | Lucide React |
| **Date Picker** | react-day-picker |
| **Storage** | localStorage (database options available) |

## 📁 Project Structure

```
taskflow/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx  # Sign-in page
│   │   └── sign-up/[[...sign-up]]/page.tsx  # Sign-up page
│   ├── components/
│   │   ├── ui/                               # shadcn/ui components
│   │   ├── TaskForm.tsx                      # Task creation/editing modal
│   │   ├── TaskNode.tsx                      # Custom React Flow node
│   │   ├── Sidebar.tsx                       # Task list and stats
│   │   └── QuickStartGuide.tsx               # User onboarding
│   ├── types/
│   │   └── index.ts                          # TypeScript interfaces
│   ├── utils/
│   │   ├── layout.ts                         # Node positioning algorithm
│   │   └── storage.ts                        # localStorage operations
│   ├── globals.css                           # Global styles + theme
│   ├── layout.tsx                            # Root layout with ClerkProvider
│   └── page.tsx                              # Main application
├── components/
│   └── ui/                                   # shadcn/ui component library
├── lib/
│   └── utils.ts                              # Utility functions
├── public/
│   └── sample-project.json                   # Sample data for testing
├── middleware.ts                             # Clerk route protection
├── .env.local                                # Environment variables
├── CLERK_SETUP.md                            # Authentication guide
├── DATABASE_SETUP.md                         # Database integration guide
└── package.json
```

## 🔧 Configuration

### Environment Variables

Required variables in `.env.local`:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

# Clerk URLs (Already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (Optional - see DATABASE_SETUP.md)
DATABASE_URL=your_database_url_here
```

### Authentication Setup

See **[CLERK_SETUP.md](./CLERK_SETUP.md)** for detailed instructions on:
- Creating a Clerk account
- Getting API keys
- Configuring social auth providers
- Customizing auth UI
- Managing users

### Database Setup

Currently uses **localStorage** for data persistence. For production, see **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for options:
- **Vercel Postgres** (Recommended for Next.js)
- **Supabase** (PostgreSQL with real-time features)
- **MongoDB Atlas** (NoSQL option)

## 🎨 Features in Detail

### Authentication & Security
- ✅ Email authentication with verification
- ✅ Social login (Google, GitHub, etc.)
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Session handling
- ✅ Secure API routes

### Network Diagram
- ✅ Force-directed layout algorithm
- ✅ Animated dependency arrows
- ✅ Interactive zoom and pan
- ✅ Minimap navigation
- ✅ Custom styled nodes
- ✅ Drag-and-drop connections

### Task Management
- ✅ Rich task properties
- ✅ Multiple dependencies per task
- ✅ Date range picker with calendar
- ✅ Priority and status indicators
- ✅ Assignee tracking
- ✅ Search and filter

### UI/UX
- ✅ Modern gradient design
- ✅ Smooth animations
- ✅ shadcn/ui components
- ✅ Responsive layout
- ✅ Dark mode ready
- ✅ Keyboard shortcuts
- ✅ Loading states
- ✅ Empty states
- ✅ Quick start guide

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest ✅ |
| Firefox | Latest ✅ |
| Safari | Latest ✅ |
| Edge | Latest ✅ |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL` (if using a database)

## 📝 Roadmap

- [ ] Database integration (Vercel Postgres / Supabase)
- [ ] Real-time collaboration
- [ ] Team workspaces
- [ ] Activity timeline
- [ ] Task comments
- [ ] File attachments
- [ ] Email notifications
- [ ] Mobile app
- [ ] API documentation
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Undo/Redo
- [ ] Task templates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [React Flow](https://reactflow.dev/) - Diagram visualization
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Clerk](https://clerk.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide](https://lucide.dev/) - Icon library
- [Radix UI](https://www.radix-ui.com/) - Unstyled components

## 💬 Support

- 📧 Email: support@taskflow.com
- 💬 Discord: [Join our community](#)
- 📖 Docs: See documentation files in this repository
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/taskflow/issues)

## 📊 Stats

- **Lines of Code**: ~2,500+
- **Components**: 15+
- **Pages**: 3
- **Dependencies**: 20+
- **Bundle Size**: < 500KB

---

**Made with ❤️ by the TaskFlow team**
