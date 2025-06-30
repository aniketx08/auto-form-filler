import json
import re
import os
from rapidfuzz import fuzz, process
from playwright.async_api import async_playwright

# --- Manual label mapping for non-standard labels ---
manual_label_map = {
    "name": "fullName",
    "full name": "fullName",
    "first name": "firstName",
    "middle name": "middleName",
    "last name": "lastName",
    "mobile number": "mobileNumber",
    "date of birth": "dob",
    "dob": "dob",
    "gender": "gender",
    "email": "email",
    "college name": "collegeName",
    "graduation year": "graduationYear",
    "cgpa": "cgpa",
    "be percentage": "BEPercent",
    "be btech": "BEPercent",  # 👈 Add this line
    "be btech percent": "BEPercent",
    "10th": "tenthPercent",
    "12th": "twelfthPercent",
    "diploma": "diplomaPercent",
    "technical achievements": "technicalAchievements",
    "personal achievements": "personalAchievements",
    "project": "project",
    "codechef rating": "codechefRating",
    "codechef profile": "codechefLink",
    "hackerrank rating": "hackerrankRating",
    "hackerrank profile": "hackerrankLink",
    "leetcode profile": "leetcodeLink",
    "leetcode problems solved": "leetcodeproblemcount",
    "cocube score": "cocubeScore"
}

# --- Utility: Clean and normalize labels ---
def clean(text):
    text = text.replace("\n", " ").replace("\xa0", " ")
    text = re.sub(r"\(.*?\)", "", text)  # remove ( ) content
    text = re.sub(r"[^\w\s]", "", text)  # remove symbols
    return text.strip().lower()

# --- Match a label to a key in the JSON using fuzzy + manual map ---
def get_best_match(label, keys, threshold=70):
    cleaned = clean(label)
    if cleaned in manual_label_map:
        return manual_label_map[cleaned]

    # Apply token_sort_ratio and fallback to partial_ratio if needed
    cleaned_keys = [clean(k) for k in keys]
    match, score, _ = process.extractOne(cleaned, cleaned_keys, scorer=fuzz.token_sort_ratio)
    
    if score < threshold:
        # Try with fuzz.partial_ratio if token_sort_ratio failed
        match, score, _ = process.extractOne(cleaned, cleaned_keys, scorer=fuzz.partial_ratio)

    for orig_key in keys:
        if clean(orig_key) == match and score >= threshold:
            return orig_key

    return None


# --- Main Form Filling Function ---
async def fill_form_main(form_url, json_path, resume_path):
    print("📝 Starting Playwright automation...")
    # Load data
    with open(json_path) as f:
        form_data = json.load(f)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(storage_state="auth.json")
        page = await context.new_page()

        # Navigate to the dynamic form URL
        await page.goto(form_url)
        await page.wait_for_timeout(3000)

        # Get all question blocks
        question_blocks = await page.locator("div[role='listitem']").all()

        for block in question_blocks:
            try:
                label_el = block.locator("div[role='heading']")
                if await label_el.count() == 0:
                    continue
                label = (await label_el.text_content()).strip()
                matched_key = get_best_match(label, list(form_data.keys()))
                if not matched_key:
                    print(f"❌ No match found for label: '{label}' → cleaned: '{clean(label)}'")
                    continue

                value = form_data[matched_key]

                # --- Handle Date field ---
                if "date" in label.lower() or "birth" in label.lower():
                    try:
                        parts = value.strip().split("/")
                        if len(parts) == 3:
                            await block.locator("input[type='date']").fill(f"{parts[2]}-{parts[1]}-{parts[0]}")
                            print(f"📅 Filled date: {label}")
                            continue
                    except Exception as e:
                        print(f"❌ Date fill error: {e}")

                # --- Handle radio buttons ---
                elif await block.locator("[role='radio']").count() > 0:
                    radios = await block.locator("[role='radio']").all()
                    for r in radios:
                        aria_label = await r.get_attribute("aria-label")
                        if aria_label and str(value).strip().lower() == aria_label.strip().lower():
                            await r.click()
                            print(f"🔘 Selected: {aria_label} for {label}")
                            break

                # --- Handle text inputs ---
                elif await block.locator("input[type='text']").count() > 0:
                    await block.locator("input[type='text']").fill(str(value))
                    print(f"✏️ Filled: {label} → {value}")

                # --- Handle textareas ---
                elif await block.locator("textarea").count() > 0:
                    await block.locator("textarea").fill(str(value))
                    print(f"📝 Filled textarea: {label} → {value}")

                # --- Handle dropdowns ---
                elif await block.locator("div[role='listbox']").count() > 0:
                    await block.locator("div[role='listbox']").first.click()
                    options = await page.locator("div[role='option']").all()
                    for option in options:
                        option_text = (await option.text_content()).strip().lower()
                        if option_text == str(value).strip().lower():
                            await option.click()
                            print(f"📂 Selected dropdown: {value} for {label}")
                            break

                else:
                    print(f"⚠️ Unhandled type: {label}")

            except Exception as e:
                print(f"❌ Block error: {e}")

        print("\n⏸️ Please manually upload the required files now.")
        input("Press Enter to continue after you’ve uploaded the files...")

        print("\n✅ All fields attempted. Please review before submitting.")
        await browser.close()
