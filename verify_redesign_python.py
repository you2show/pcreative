from playwright.sync_api import sync_playwright

def verify_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:5173/')
        page.wait_for_timeout(3000) # Wait for animations
        page.screenshot(path='final-redesign.png', full_page=True)
        browser.close()

if __name__ == "__main__":
    verify_redesign()
