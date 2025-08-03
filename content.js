document.getElementById("apply_btn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: runFullProcess
    });
});

document.getElementById("print").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyPrintStylesAndPrint
    });
});

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
        if (window.DocumentManager?.prototype?.removeBlurring) {
            console.log("[Extension] Native removeBlurring()");
            const docManager = new window.DocumentManager();
            docManager.removeBlurring();
        } else if (typeof window.removeBlurring === "function") {
            console.log("[Extension] Global removeBlurring()");
            window.removeBlurring();
        } else {
            console.log("[Extension] Manual unblur fallback");

            document.querySelectorAll(".promo_div").forEach(el => el.remove());

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
        }
    } catch (err) {
        console.error("[Extension] Unblur script failed:", err);
    }
}

function runFullProcess() {
    console.log("🔁 Running full automation process...");

    // Scroll to bottom then top with delay
    async function scrollPageSequence() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

        console.log("🔁 Running full automation process...");

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }


        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        await delay(1000);

        window.scrollTo({ top: 0, behavior: "smooth" });
        await delay(1000);

        clickFullscreenButton();
        zoomOutThreeTimes();
        unblurDocument();
        await delay(1000);

        console.log("✅ Full automation completed");
        applyPrintStylesAndPrint();

    }

    // Click fullscreen button
    function clickFullscreenButton() {
        const btn = document.querySelector('button[data-e2e="full-screen-icon"]');
        if (btn) {
            btn.click();
            console.log("✅ Fullscreen clicked");
        } else {
            console.warn("❌ Fullscreen button not found");
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
            if (window.DocumentManager?.prototype?.removeBlurring) {
                console.log("[Extension] Native removeBlurring()");
                const docManager = new window.DocumentManager();
                docManager.removeBlurring();
            } else if (typeof window.removeBlurring === "function") {
                console.log("[Extension] Global removeBlurring()");
                window.removeBlurring();
            } else {
                console.log("[Extension] Manual unblur fallback");

                document.querySelectorAll(".promo_div").forEach(el => el.remove());

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
            }
        } catch (err) {
            console.error("[Extension] Unblur script failed:", err);
        }
    }

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

    scrollPageSequence();
}

