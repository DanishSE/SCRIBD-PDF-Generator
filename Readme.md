# 🖨️ SCRIBD DOM Helper – Chrome Extension

A powerful Chrome extension crafted to enhance your experience on content-heavy platforms like **Scribd**, **Studocu**, and similar document-based websites. This tool simplifies content interaction by offering two key features:

- 🖨️ **Print Cleaner Pages**
- 🔓 **Unblur Hidden Content**

---

## 🚀 Features

### 🖨️ Print Cleaner Pages
Streamline the content before printing:

1. **Automatic Page Scroll**  
   Ensures dynamic content is fully loaded by scrolling down and then returning to the top.

2. **Smart Print Styling**  
   Injects custom `@media print` CSS to:
   - Remove UI clutter (e.g., headers, sidebars, ads, overlays)
   - Show only the essential content

3. **Trigger Print Dialog**  
   After styling, the extension opens the native print dialog (`window.print()`).

4. **Auto Cleanup**  
   The injected styles are removed after printing to avoid residual effects.

---

### 🔓 Unblur Hidden Content
Quickly reveal blurred or hidden content sections by removing obfuscating styles.

> ⚠️ Currently designed for **Studocu** and **Scribd**. You may need to customize the target selectors in `content.js` if using it on other websites.

---

## ⚙️ Installation & Setup

1. Clone or download this repository to your computer.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer Mode** (top right toggle).
4. Click **Load unpacked**.
5. Select the extension's root folder.

> 💡 You should now see the extension icon in your toolbar.

---

## 🧪 How to Use

### For Printing:
1. Navigate to a supported document page.
2. Click the **Print** button (from extension UI or popup).
3. The extension will:
   - Scroll and load content
   - Inject print-specific styles
   - Open print preview
4. Review, print, or save as PDF.

### For Unblurring:
- Automatically removes overlays or hidden styles on supported platforms.
- For advanced control, you can customize the script inside `content.js`.

---

## 🧰 Customization

You can edit:
- **Element selectors** in `content.js` for `unblur` functionality.
- **CSS rules** inside the `printStyle` function to fine-tune which sections are hidden or styled for print.

---

## 🔐 Required Permissions

```json
{
  "permissions": [
    "activeTab",
    "scripting"
  ]
}
