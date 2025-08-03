const apply_btn = document.getElementById("apply_btn");

apply_btn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    apply_btn.disabled = true; // Disable button to prevent multiple clicks
    apply_btn.textContent = "Processing...";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: runFullProcess
    });
});

// document.getElementById("print").addEventListener("click", async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: applyPrintStylesAndPrint
//     });
// });

document.getElementById("unblur").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: unblurDocument
    });
});

// =================== FUNCTIONS TO INJECT ===================

function applyPrintStylesAndPrint() {
    const style = document.createElement("style");
    style.innerHTML = `
    ._2P_-2J { opacity: 1 !important; }
    .GfPAgr { display: none !important; }
    ._1qNr2d, .i81L9W { backdrop-filter: none !important; }
    @media print {
      ._1xqRH2, ._3DZ17z, .Footer-module_wrapper__7jj0T { display: none !important; }
    }
  `;
    document.head.appendChild(style);

    setTimeout(() => window.print(), 300);
}

function unblurDocument() {
    try {

        console.log("[Extension] Manual unblur fallback");

        document.querySelectorAll(".promo_div").forEach(el => el.remove());
        document.querySelectorAll(".between_page_portal_root").forEach(el => el.remove());
        document.querySelectorAll(".text_layer").forEach(el => {
            el.style.textShadow = el.dataset.initialTextShadow || "none";
            el.style.color = el.dataset.initialColor || "#000";
        });

        document.querySelectorAll(".text_layer [style]").forEach(el => {
            el.style.color = el.dataset.initialColor || "#000";
        });

        document.querySelectorAll(".image_layer img").forEach(el => {
            el.style.opacity = el.dataset.initialOpacity || "1";
        });

        document.querySelectorAll("._2P_-2J, .blurred, .outer_page").forEach(el =>
            el.classList.remove("blurred", "_2P_-2J")
        );
    } catch (err) {
        console.error("[Extension] Unblur script failed:", err);
    }
}

function runFullProcess() {
    console.log("🔁 Running full automation process...");
    existFullscreenButton()
    // Scroll to bottom then top with delay
    async function scrollPageSequence() {
        console.log("🔁 Running full automation process...");

        window.scrollTo({ top: 0, behavior: "smooth" });


        // Wait a bit
        await delay(800);

        // Scroll to bottom slowly
        await smoothScrollTo(document.body.scrollHeight, 20);

        await delay(500);

        // Scroll back to top again slowly
        window.scrollTo({ top: 0, behavior: "smooth" });

        await delay(500);
        // Click fullscreen button
        clickFullscreenButton();
        await delay(200);
        zoomOutThreeTimes();
        unblurDocument();
        await delay(1000);

        console.log("✅ Full automation completed");
        applyPrintStylesAndPrint();

    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function smoothScrollTo(targetY, stepDelay = 10) {
        const step = window.scrollY < targetY ? 120 : -120;
        const tolerance = 20; // Allow small margin to treat as "done"

        return new Promise(resolve => {
            const interval = setInterval(() => {
                const currentY = window.scrollY;
                const distance = Math.abs(currentY - targetY);

                // Stop if close enough or reached limit
                if (distance <= tolerance ||
                    (step > 0 && currentY + window.innerHeight >= document.body.scrollHeight) ||
                    (step < 0 && currentY <= 0)
                ) {
                    clearInterval(interval);
                    resolve();
                    return;
                }

                window.scrollBy(0, step);
            }, stepDelay);
        });
    }

    function existFullscreenButton() {
        const btn = document.querySelector('button[data-e2e="full-screen-icon"]');

        if (!btn) {
            console.warn("❌ Fullscreen button not found");
            return;
        }
        // Find the visually hidden <span> inside the button
        const labelSpan = btn.querySelectorAll('span');

        if (!labelSpan) {
            console.warn("❌ Label span not found inside fullscreen button");
            return;
        }

        let isFullscreen = true;

        labelSpan.forEach(span => {
            if (span.textContent.trim()) {
                if (span.textContent.trim().toLowerCase() === "fullscreen") {
                    isFullscreen = false;
                }
            }
        })

        if (isFullscreen) {
            btn.click();
            console.log("✅ Fullscreen clicked");
        } else {
            console.log("🛑 Already in fullscreen — no need to click");
        }
    }

    // Click fullscreen button
    function clickFullscreenButton() {
        const btn = document.querySelector('button[data-e2e="full-screen-icon"]');

        if (!btn) {
            console.warn("❌ Fullscreen button not found");
            return;
        }

        // Find the visually hidden <span> inside the button
        const labelSpan = btn.querySelectorAll('span');

        if (!labelSpan) {
            console.warn("❌ Label span not found inside fullscreen button");
            return;
        }

        let isFullscreen = true;

        labelSpan.forEach(span => {
            if (span.textContent.trim()) {
                if (span.textContent.trim().toLowerCase() === "fullscreen") {
                    isFullscreen = false;
                }
            }
        })

        if (!isFullscreen) {
            btn.click();
            console.log("✅ Fullscreen clicked");
        } else {
            console.log("🛑 Already in fullscreen — no need to click");
        }
    }


    // Zoom out 3 times with delay
    function zoomOutThreeTimes() {
        const btn = document.querySelector('button[data-e2e="zoom-out-icon"]');
        if (!btn) return console.warn("❌ Zoom-out button not found");

        let count = 0;
        const interval = setInterval(() => {
            if (count >= 3) return clearInterval(interval);
            btn.click();
            console.log(`🔍 Zoom-out click ${++count}`);
        }, 300);
    }

    // Remove blurring overlays
    function unblurDocument() {
        try {

            console.log("[Extension] Manual unblur fallback");

            document.querySelectorAll(".promo_div").forEach(el => el.remove());
            document.querySelectorAll(".between_page_portal_root").forEach(el => el.remove());
            document.querySelectorAll(".text_layer").forEach(el => {
                el.style.textShadow = el.dataset.initialTextShadow || "none";
                el.style.color = el.dataset.initialColor || "#000";
            });

            document.querySelectorAll(".text_layer [style]").forEach(el => {
                el.style.color = el.dataset.initialColor || "#000";
            });

            document.querySelectorAll(".image_layer img").forEach(el => {
                el.style.opacity = el.dataset.initialOpacity || "1";
            });

            document.querySelectorAll("._2P_-2J, .blurred, .outer_page").forEach(el =>
                el.classList.remove("blurred", "_2P_-2J")
            );

        } catch (err) {
            console.error("[Extension] Unblur script failed:", err);
        }
    }

    async function applyPrintStylesAndPrint() {
        const style = document.createElement("style");
        style.innerHTML = `
    ._2P_-2J { opacity: 1 !important; }
    .GfPAgr { display: none !important; }
    ._1qNr2d, .i81L9W { backdrop-filter: none !important; }
    @media print {
      ._1xqRH2, ._3DZ17z, .Footer-module_wrapper__7jj0T { display: none !important; }
    }
  `;
        document.head.appendChild(style);

        await delay(300)

        window.print()


        window.onafterprint = () => {
            chrome.runtime.sendMessage({ type: "PRINT_DONE" });

        };
    }

    scrollPageSequence();
}

