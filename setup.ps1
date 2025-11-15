# TaskFlow Setup Script
# Run this after cloning the repository

Write-Host "🚀 Setting up TaskFlow..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Dependencies installed successfully" -ForegroundColor Green

# Check if .env.local exists
Write-Host ""
Write-Host "🔑 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "  ! .env.local not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "  ✓ .env.local created from template" -ForegroundColor Green
        Write-Host "  ⚠ Please add your MongoDB URI and Clerk keys to .env.local" -ForegroundColor Yellow
    } else {
        Write-Host "  ! Creating new .env.local file..." -ForegroundColor Yellow
        @"
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "  ✓ .env.local created" -ForegroundColor Green
        Write-Host "  ⚠ Please add your MongoDB URI and Clerk keys to .env.local" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Set up MongoDB Atlas:" -ForegroundColor White
Write-Host "   • Go to https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
Write-Host "   • Create a free cluster (M0)" -ForegroundColor Gray
Write-Host "   • Get your connection string" -ForegroundColor Gray
Write-Host "   • See MONGODB_SETUP.md for details" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up Clerk Authentication:" -ForegroundColor White
Write-Host "   • Go to https://dashboard.clerk.com" -ForegroundColor Gray
Write-Host "   • Create a new application" -ForegroundColor Gray
Write-Host "   • Copy your API keys" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Update .env.local file:" -ForegroundColor White
Write-Host "   • Add your MONGODB_URI" -ForegroundColor Gray
Write-Host "   • Add your Clerk keys" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Open your browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • GETTING_STARTED.md - Quick start guide" -ForegroundColor Gray
Write-Host "   • MONGODB_SETUP.md - MongoDB setup details" -ForegroundColor Gray
Write-Host "   • IMPLEMENTATION_COMPLETE.md - Features overview" -ForegroundColor Gray
Write-Host "   • README.md - Full documentation" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
Write-Host ""
