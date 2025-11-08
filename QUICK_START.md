# TaskFlow - Quick Start & Setup Checklist

## 🎯 Overview
This is your complete setup checklist for TaskFlow. Follow these steps in order.

---

## ✅ Setup Checklist

### 1. Dependencies (Already Done ✓)
```bash
npm install
```
- [x] Next.js 16
- [x] React 19
- [x] Clerk authentication
- [x] shadcn/ui components
- [x] React Flow
- [x] Tailwind CSS 4

### 2. Clerk Authentication Setup (REQUIRED)

#### Step 2.1: Get Clerk API Keys
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application (e.g., "TaskFlow")
3. Navigate to **API Keys** in the Clerk dashboard
4. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

#### Step 2.2: Configure Environment Variables
1. Open `.env.local` in your project
2. Replace the placeholder values:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
```

#### Step 2.3: Configure Clerk Dashboard
1. Go to **Social Providers** (optional)
   - Enable Google, GitHub, etc.
2. Go to **Email & SMS**
   - Verify email templates
3. Go to **Paths**
   - Verify redirect URLs match:
     - Sign in: `/sign-in`
     - Sign up: `/sign-up`
     - After sign in: `/`

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

**Expected Behavior:**
- ✅ You're redirected to `/sign-in`
- ✅ You can create an account
- ✅ After sign-in, you see the TaskFlow dashboard
- ✅ User button appears in top-right corner

### 4. Test Core Features

#### Test Authentication
- [ ] Sign up with email
- [ ] Sign in works
- [ ] User button shows profile
- [ ] Sign out works
- [ ] Protected routes redirect to sign-in

#### Test Task Management
- [ ] Create a task
- [ ] Edit a task
- [ ] Delete a task
- [ ] View task in network diagram

#### Test Network Diagram
- [ ] Create task with dependency
- [ ] See arrow connecting tasks
- [ ] Zoom and pan works
- [ ] Minimap shows overview

#### Test Data Persistence
- [ ] Create tasks
- [ ] Refresh page
- [ ] Tasks still exist (localStorage)
- [ ] Export data as JSON
- [ ] Import data from JSON

---

## 🗄️ Database Setup (Optional but Recommended for Production)

### Why Add a Database?
- **Multi-device sync**: Access tasks from any device
- **Team collaboration**: Share projects with team members
- **Better security**: User data stored securely
- **Scalability**: Handle thousands of tasks
- **Backup**: Automatic data backup

### Quick Database Setup (Vercel Postgres - Recommended)

#### Option A: Vercel Postgres

1. **Install Vercel Postgres**
```bash
npm install @vercel/postgres drizzle-orm drizzle-kit
```

2. **Create Vercel Database**
   - Go to [vercel.com](https://vercel.com)
   - Navigate to your project → Storage
   - Create Postgres database
   - Copy connection string to `.env.local`:
```env
DATABASE_URL=postgres://...
```

3. **See DATABASE_SETUP.md** for complete implementation

#### Option B: Supabase (Free Tier)

1. **Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

2. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get API keys and URL
   - Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. **See DATABASE_SETUP.md** for complete implementation

---

## 🐛 Troubleshooting

### Issue: "Clerk keys not found"
**Solution:**
1. Verify keys are in `.env.local`
2. Restart dev server: `npm run dev`
3. Check for spaces or quotes around keys

### Issue: Hydration Error
**Solution:**
✅ Already fixed with:
- `suppressHydrationWarning` in layout.tsx
- Client-side checks with `isClient` state
- Loading state before rendering content

### Issue: Sign-in redirect loop
**Solution:**
1. Check middleware.ts configuration
2. Verify Clerk dashboard paths match
3. Clear browser cookies and try again

### Issue: Tasks not saving
**Solution:**
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check browser storage quota

### Issue: Network diagram not showing
**Solution:**
1. Create at least one task
2. Check React Flow console errors
3. Verify dependencies are installed

---

## 📂 File Reference

### Core Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main application, task management |
| `app/layout.tsx` | Root layout with Clerk provider |
| `middleware.ts` | Route protection |
| `.env.local` | Environment variables (NEVER commit!) |
| `app/components/TaskForm.tsx` | Task creation/editing |
| `app/components/TaskNode.tsx` | Network diagram nodes |
| `app/components/Sidebar.tsx` | Task list and stats |

### Documentation Files

| File | Contents |
|------|----------|
| `README.md` | Main documentation |
| `CLERK_SETUP.md` | Authentication guide |
| `DATABASE_SETUP.md` | Database integration |
| `USER_GUIDE.md` | How to use features |
| `PROJECT_SUMMARY.md` | Technical details |

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] All environment variables configured
- [ ] Clerk production keys (not test keys)
- [ ] Database connection tested
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in production mode

### Deploy to Vercel

1. **Connect GitHub**
   - Push code to GitHub
   - Import project in Vercel

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
   - Use production Clerk keys

3. **Configure Clerk**
   - Go to Clerk dashboard
   - Update allowed URLs to include your Vercel domain
   - Example: `https://taskflow.vercel.app`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Test all features on production URL

### Post-Deployment Testing

- [ ] Sign up works on production
- [ ] Sign in works
- [ ] Tasks can be created
- [ ] Network diagram renders
- [ ] Export/import works
- [ ] No console errors

---

## 🎓 Learning Resources

### For Beginners

1. **Next.js Basics**
   - [Next.js Tutorial](https://nextjs.org/learn)
   - [App Router Guide](https://nextjs.org/docs/app)

2. **React Flow**
   - [React Flow Docs](https://reactflow.dev/learn)
   - [Examples](https://reactflow.dev/examples)

3. **Clerk Authentication**
   - [Clerk Quickstart](https://clerk.com/docs/quickstarts/nextjs)
   - [Video Tutorials](https://clerk.com/docs/tutorials)

### Advanced Topics

- **Database Integration**: See DATABASE_SETUP.md
- **API Routes**: Create `/app/api/tasks/route.ts`
- **Real-time Updates**: Use Supabase subscriptions
- **Team Features**: Clerk Organizations

---

## 💡 Common Workflows

### Adding a New Feature

1. **Plan**: Decide what you want to add
2. **Create Component**: Add to `app/components/`
3. **Update Types**: Add to `app/types/index.ts`
4. **Test**: Verify it works locally
5. **Deploy**: Push to production

### Debugging Issues

1. **Check Console**: Browser developer tools (F12)
2. **Check Terminal**: npm run dev output
3. **Check Network**: Network tab for API calls
4. **Check Clerk**: Clerk dashboard for auth issues
5. **Check Storage**: Browser storage in dev tools

### Customizing Design

1. **Colors**: Edit `app/globals.css` theme variables
2. **Components**: Modify files in `app/components/`
3. **Layout**: Update `app/page.tsx` structure
4. **Styles**: Use Tailwind classes or add custom CSS

---

## 🎉 Next Steps

### Immediate (Week 1)
1. ✅ Set up Clerk authentication
2. ✅ Create your first project
3. ✅ Invite team members (if needed)

### Short-term (Week 2-4)
4. 🔄 Add database integration
5. 🔄 Deploy to production
6. 🔄 Customize branding

### Long-term (Month 2+)
7. 🔄 Add team features
8. 🔄 Implement notifications
9. 🔄 Add mobile app

---

## 📞 Need Help?

1. **Check Documentation**
   - README.md (overview)
   - CLERK_SETUP.md (auth)
   - DATABASE_SETUP.md (database)
   - USER_GUIDE.md (features)

2. **Common Issues**
   - See Troubleshooting section above
   - Check browser console for errors
   - Verify environment variables

3. **Still Stuck?**
   - Review Clerk documentation
   - Check Next.js docs
   - Open GitHub issue

---

## ✨ Tips for Success

1. **Start Simple**: Get auth working first, then add database
2. **Test Often**: Test each feature as you build it
3. **Use Examples**: Load sample-project.json to see features
4. **Read Docs**: All setup guides are in this repository
5. **Take Breaks**: Development is a marathon, not a sprint!

---

**You're ready to go! Start with Clerk setup, then run the app. Good luck! 🚀**
