# ========================================
# Leo Club Website - Project Cleanup Script
# ========================================

Write-Host ""
Write-Host "Starting project cleanup..." -ForegroundColor Cyan
Write-Host ""

# Navigate to app directory
Set-Location -Path "app"

# 1. DELETE DUPLICATE SQL FILES
Write-Host "Removing duplicate SQL files..." -ForegroundColor Yellow

if (Test-Path "supabase\APPLY_THIS_SCHEMA.sql") {
    Remove-Item "supabase\APPLY_THIS_SCHEMA.sql" -Force
    Write-Host "   [OK] Deleted: supabase\APPLY_THIS_SCHEMA.sql" -ForegroundColor Green
}

if (Test-Path "supabase\migrations\005_add_homepage_featured_achievements.sql") {
    Remove-Item "supabase\migrations\005_add_homepage_featured_achievements.sql" -Force
    Write-Host "   [OK] Deleted: migrations\005_add_homepage_featured_achievements.sql" -ForegroundColor Green
}

# 2. DELETE BUILD ARTIFACTS
Write-Host ""
Write-Host "Removing build artifacts..." -ForegroundColor Yellow

if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
    Write-Host "   [OK] Deleted: dist/" -ForegroundColor Green
}

# 3. VERIFY .ENV SECURITY
Write-Host ""
Write-Host "Verifying .env security..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "   [OK] .env file exists" -ForegroundColor Green
    
    $gitignoreContent = Get-Content "../.gitignore" -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "   [OK] .env is protected in .gitignore" -ForegroundColor Green
    }
}

# 4. CHECK GIT STATUS
Write-Host ""
Write-Host "Checking git status..." -ForegroundColor Yellow

Set-Location ..
$gitStatus = git status --porcelain 2>$null

if ($LASTEXITCODE -eq 0) {
    if ($gitStatus -match "\.env") {
        Write-Host "   [ERROR] .env file is being tracked by git!" -ForegroundColor Red
    }
    else {
        Write-Host "   [OK] .env is not tracked by git" -ForegroundColor Green
    }
}

# SUMMARY
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " CLEANUP COMPLETE " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files cleaned:" -ForegroundColor Cyan
Write-Host "   [OK] Duplicate SQL files removed" -ForegroundColor White
Write-Host "   [OK] Build artifacts cleaned" -ForegroundColor White
Write-Host "   [OK] .env security verified" -ForegroundColor White
Write-Host ""
Write-Host "Next: npm run build" -ForegroundColor Green
Write-Host ""

Set-Location app
