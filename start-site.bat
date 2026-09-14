@echo off
REM تشغيل موقع GGH Team (النسخة المبنية في مجلد dist)
cd /d "%~dp0dist"
echo ============================================
echo  جاري تشغيل الموقع على http://localhost:8080
echo  افتح الرابط ده في المتصفح لو ما اتفتحش لوحده
echo  للايقاف: اقفل النافذة دي او دوس Ctrl+C
echo ============================================
start "" http://localhost:8080
IF EXIST "X:\Apps\Python\python.exe" (
  "X:\Apps\Python\python.exe" -m http.server 8080
) ELSE (
  python -m http.server 8080
)
pause
