# login_and_save_auth.py
import asyncio
from playwright.async_api import async_playwright

async def save_login_state():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("https://accounts.google.com")  # Or your Google Form link
        print("✅ Please log in manually...")
        await page.wait_for_timeout(30000)  # 30 seconds for manual login

        await context.storage_state(path="auth.json")
        print("✅ Login session saved as auth.json.")
        await browser.close()

asyncio.run(save_login_state())
