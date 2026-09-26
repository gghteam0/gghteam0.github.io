@echo off
chcp 65001 >nul
title GameRouteOptimizer - محسن مسار الالعاب
echo.
echo  ============================================
echo   GameRouteOptimizer v2.0 - محسن مسار الالعاب
echo  ============================================
echo.
:: لو تريد خصائص DNS والRoutes والتعديلات: كليك يمين على الملف ^> تشغيل كمسؤول
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo  [تنبيه] انت لست ادمن - القياسات ستعمل عادي، لكن تطبيق DNS والRoutes يحتاج ادمن.
    echo.
)
python "%~dp0GameRouteOptimizer.py"
if %errorlevel% neq 0 (
    echo.
    echo  [خطأ] تعذر التشغيل - تأكد ان بايثون مثبت: python --version
    pause
)
