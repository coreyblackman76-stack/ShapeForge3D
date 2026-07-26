(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const toast = (msg) => {
    const el = $("#toast"); if(!el) return;
    el.textContent = msg; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2800);
  };

  const page = document.body.dataset.page;
  $$(".nav-link").forEach(a => {
    const key = a.dataset.route;
    if ((page === "home" && key === "home") || (page && key.includes(page))) a.classList.add("active");
  });

  $("#menuButton")?.addEventListener("click", () => $("#sidebar")?.classList.toggle("open"));
  document.addEventListener("click", e => {
    if (window.innerWidth <= 1000 && !e.target.closest(".sidebar") && !e.target.closest("#menuButton")) {
      $("#sidebar")?.classList.remove("open");
    }
  });

  $("#globalSearch")?.addEventListener("keydown", e => {
    if (e.key === "Enter") toast(`Search prepared for “${e.target.value || "all content"}”. Search backend connects later.`);
  });

  document.querySelector('[data-action="forge-prompt"]')?.addEventListener("click", () => {
    const value = $("#homePrompt")?.value.trim();
    if (!value) return toast("Describe what you want to create first.");
    localStorage.setItem("sf_pending_prompt", value);
    location.href = "pages/forge.html?prompt=1";
  });

  if (page === "forge") {
    const saved = localStorage.getItem("sf_pending_prompt");
    if (saved && $("#forgePrompt")) {
      $("#forgePrompt").value = saved;
      localStorage.removeItem("sf_pending_prompt");
    }
    const inputs = ["#imageInput","#videoInput","#modelInput"];
    inputs.forEach(id => $(id)?.addEventListener("change", e => {
      if (e.target.files?.[0]) toast(`${e.target.files[0].name} added to this project.`);
    }));

    $("#beginForge")?.addEventListener("click", async () => {
      const prompt = $("#forgePrompt")?.value.trim();
      if (!prompt) return toast("Describe your idea before starting.");
      $("#previewTitle").textContent = prompt.length > 55 ? prompt.slice(0,55) + "…" : prompt;
      $("#previewMeta").textContent = "Project created locally in this browser.";
      const items = $$(".progress-list li");
      const bar = $("#progressBar");
      const pct = $("#progressPercent");
      items.forEach(i => i.className = "");
      $("#continueProject").disabled = true;
      for (let i=0;i<items.length;i++){
        items[i].classList.add("active");
        const p = Math.round(((i+1)/items.length)*100);
        bar.style.width = p+"%"; pct.textContent = p+"%";
        await new Promise(r => setTimeout(r, 650));
        items[i].classList.remove("active"); items[i].classList.add("done");
      }
      $("#scoreValue").textContent = "Preview ready";
      $("#continueProject").disabled = false;
      const projects = JSON.parse(localStorage.getItem("sf_projects") || "[]");
      projects.unshift({name: prompt, created: new Date().toISOString(), status:"preview"});
      localStorage.setItem("sf_projects", JSON.stringify(projects.slice(0,20)));
      toast("Project created. The real AI model-generation service connects in a backend sprint.");
    });

    $("#continueProject")?.addEventListener("click", () => toast("Project workspace saved locally. Cloud saving requires user accounts and a database."));
  }

  if (page === "scan") {
    const update = () => {
      const photos = $("#photoScanInput")?.files?.length || 0;
      const video = $("#videoScanInput")?.files?.[0];
      $("#captureStatus").textContent = photos ? `${photos} photo${photos>1?"s":""} selected.` : video ? `Video selected: ${video.name}` : "No files selected.";
    };
    $("#photoScanInput")?.addEventListener("change", update);
    $("#videoScanInput")?.addEventListener("change", update);
    $("#prepareScan")?.addEventListener("click", () => {
      const photos = $("#photoScanInput")?.files?.length || 0;
      const video = $("#videoScanInput")?.files?.[0];
      if (!photos && !video) return toast("Choose photos or a video first.");
      toast("Scan project prepared. 3D reconstruction requires a photogrammetry backend.");
    });
  }

  $$(".use-model").forEach(btn => btn.addEventListener("click", () => toast("Design added to a new project preview.")));

  if (page === "print") {
    const calculate = () => {
      const mat = +$("#material").value, quality = +$("#quality").value, qty = Math.max(1,+$("#quantity").value||1);
      const value = 24 * mat * quality * qty;
      $("#quoteValue").textContent = new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(value);
      $("#quoteTime").textContent = `Estimated print time: ${(4.2*quality*qty).toFixed(1)} hours`;
    };
    $("#calculateQuote")?.addEventListener("click", () => { calculate(); toast("Demonstration estimate calculated."); });
    $("#requestQuote")?.addEventListener("click", () => toast("Final quote requests need an order backend and print partner connection."));
  }

  document.querySelector('[data-action="save-settings"]')?.addEventListener("click", () => toast("Settings saved in this browser."));
  $("#reduceMotion")?.addEventListener("change", e => document.documentElement.style.scrollBehavior = e.target.checked ? "auto" : "smooth");
})();