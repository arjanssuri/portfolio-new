// shared by every article page

// reading progress bar
const bar = document.getElementById("progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// fade figures in as they scroll into view
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }
}, { rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const words = document.querySelector(".prose").innerText.trim().split(/\s+/).length;
document.getElementById("read-time").textContent = Math.max(1, Math.round(words / 230)) + " min read";

// copy button on every code block, like x
const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

document.querySelectorAll(".prose pre").forEach((pre) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy";
  btn.setAttribute("aria-label", "copy code");
  btn.innerHTML = COPY_ICON + "<span>copy</span>";
  btn.addEventListener("click", async () => {
    await copyText(pre.querySelector("code").innerText);
    btn.classList.add("done");
    btn.innerHTML = CHECK_ICON + "<span>copied</span>";
    clearTimeout(btn.timer);
    btn.timer = setTimeout(() => {
      btn.classList.remove("done");
      btn.innerHTML = COPY_ICON + "<span>copy</span>";
    }, 1600);
  });
  // the wrapper keeps the button pinned while long lines scroll sideways
  const wrap = document.createElement("div");
  wrap.className = "codeblock";
  pre.replaceWith(wrap);
  wrap.append(pre, btn);
});
