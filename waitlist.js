(function () {
  var root = document.getElementById("wl");
  var form = document.getElementById("webinar-waitlist-form");
  var success = document.getElementById("waitlist-success");
  var globalError = document.getElementById("waitlist-form-error");
  var submitBtn = document.getElementById("waitlist-submit");
  var otherField = document.getElementById("other-process-field");
  var otherInput = document.getElementById("other_process");
  var processInput = document.getElementById("selected_process");
  var progress = document.getElementById("wl-progress");
  var recap = document.getElementById("wl-recap");
  var successName = document.getElementById("wl-success-name");

  if (!root || !form) return;

  var LAST = 4;
  var DONE = 5;
  var step = 0;
  var busy = false;
  var screens = Array.prototype.slice.call(form.querySelectorAll(".wl-step"));

  function clearErrors() {
    ["first_name", "email", "agency_website", "selected_process", "other_process"].forEach(function (name) {
      var el = document.getElementById("error-" + name);
      if (!el) return;
      el.hidden = true;
      el.textContent = "";
    });
    if (globalError) {
      globalError.hidden = true;
      globalError.textContent = "";
    }
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  function err(name, msg) {
    var el = document.getElementById("error-" + name);
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    }
    var input = form.querySelector("#" + name);
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function syncOther() {
    var isOther = processInput && processInput.value === "Other";
    if (otherField) otherField.hidden = !isOther;
    if (otherInput && !isOther) otherInput.value = "";
  }

  function updateSuccessCopy() {
    var name = (form.first_name && form.first_name.value.trim()) || "there";
    var process = (processInput && processInput.value) || "";
    if (successName) successName.textContent = name;
    if (recap && process) {
      recap.textContent = "Your vote: " + process.toLowerCase() + " first.";
      recap.hidden = false;
    } else if (recap) {
      recap.hidden = true;
      recap.textContent = "";
    }
  }

  function setStep(n) {
    step = n;
    root.dataset.step = String(step);
    screens.forEach(function (screen) {
      var i = Number(screen.getAttribute("data-panel"));
      var on = i === step;
      screen.hidden = !on;
      screen.classList.toggle("is-on", on);
    });
    if (progress) {
      progress.style.width = (step >= DONE ? 100 : ((step + 1) / (LAST + 1)) * 100) + "%";
    }
    if (step === DONE) updateSuccessCopy();
    var active = form.querySelector(".wl-step.is-on");
    if (active) {
      var focus =
        active.querySelector("input:not([type=hidden]):not([tabindex='-1'])") ||
        active.querySelector("button[data-go='next'], button[type=submit], .wl-choice, a.btn");
      if (focus) {
        requestAnimationFrame(function () {
          focus.focus({ preventScroll: true });
        });
      }
    }
    if (step === DONE && success) success.focus({ preventScroll: true });
  }

  function valid(i) {
    clearErrors();
    if (i === 1) {
      if (!processInput || !processInput.value) {
        err("selected_process", "Pick a process to continue.");
        return false;
      }
      if (processInput.value === "Other" && (!otherInput || otherInput.value.trim().length < 2)) {
        err("other_process", "Briefly describe the process.");
        if (otherInput) otherInput.focus();
        return false;
      }
      return true;
    }
    if (i === 2) {
      if (!form.first_name || form.first_name.value.trim().length < 2) {
        err("first_name", "Enter your first name.");
        return false;
      }
      return true;
    }
    if (i === 3) {
      var email = (form.email && form.email.value.trim()) || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err("email", "Enter a valid email.");
        return false;
      }
      return true;
    }
    if (i === 4) {
      if (!form.agency_website || !form.agency_website.value.trim()) {
        err("agency_website", "Enter your agency website.");
        return false;
      }
      return true;
    }
    return true;
  }

  function next() {
    if (step >= DONE || busy) return;
    if (step === LAST) {
      form.requestSubmit();
      return;
    }
    // Email step must verify uniqueness before advancing.
    if (step === 3) {
      checkEmailThenContinue();
      return;
    }
    if (!valid(step)) return;
    setStep(Math.min(step + 1, LAST));
  }

  function setEmailContinueLabel(label) {
    var btn = document.getElementById("wl-email-continue");
    if (!btn) return;
    var text = btn.querySelector(".btn__text");
    if (text) text.textContent = label;
    btn.disabled = label === "Checking...";
  }

  async function checkEmailThenContinue() {
    if (busy) return;
    if (step !== 3) setStep(3);

    clearErrors();
    var emailInput = document.getElementById("email") || (form.elements && form.elements.email);
    var email = (emailInput && emailInput.value ? emailInput.value.trim() : "") || "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err("email", "Enter a valid email.");
      if (emailInput) emailInput.focus();
      return;
    }

    busy = true;
    setEmailContinueLabel("Checking...");

    try {
      var res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_email", email: email }),
      });
      var data = await res.json().catch(function () {
        return {};
      });

      if (!res.ok) {
        err(
          "email",
          (data.errors && data.errors.email) || data.error || "Could not check email. Please try again."
        );
        busy = false;
        setEmailContinueLabel("Continue");
        return;
      }

      if (data.available === false || (data.errors && data.errors.email)) {
        err("email", (data.errors && data.errors.email) || "That email is already on the waitlist.");
        if (emailInput) emailInput.focus();
        busy = false;
        setEmailContinueLabel("Continue");
        return;
      }

      if (data.available !== true) {
        err("email", "Could not verify this email. Please try again.");
        busy = false;
        setEmailContinueLabel("Continue");
        return;
      }

      busy = false;
      setEmailContinueLabel("Continue");
      setStep(4);
    } catch (_) {
      err("email", "Network error. Check your connection and try again.");
      busy = false;
      setEmailContinueLabel("Continue");
    }
  }

  function back() {
    if (step <= 0 || step >= DONE) return;
    clearErrors();
    setStep(step - 1);
  }

  form.querySelectorAll(".wl-choice").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-process") || "";
      if (processInput) processInput.value = value;
      form.querySelectorAll(".wl-choice").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      syncOther();
      clearErrors();
      if (value === "Other" && otherInput) {
        otherInput.focus();
      }
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.shiftKey) return;
      e.preventDefault();
      btn.click();
      if (processInput && processInput.value && processInput.value !== "Other") {
        next();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (step !== 1) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 6) {
      var btn = form.querySelectorAll(".wl-choice")[n - 1];
      if (btn) btn.click();
    }
  });

  root.querySelectorAll("[data-go='next']").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      next();
    });
  });
  root.querySelectorAll("[data-go='check-email']").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      checkEmailThenContinue();
    });
  });
  root.querySelectorAll("[data-go='back']").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      back();
    });
  });

  form.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (e.target && e.target.closest("button[type=submit]")) return;
    if (step === DONE) return;
    e.preventDefault();
    if (step === 3) {
      checkEmailThenContinue();
      return;
    }
    next();
  });

  function track() {
    try {
      if (typeof window.va === "function") window.va("event", { name: "webinar_waitlist_joined" });
    } catch (_) {}
    try {
      if (window.posthog && typeof window.posthog.capture === "function") {
        window.posthog.capture("webinar_waitlist_joined");
      }
    } catch (_) {}
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (busy) return;
    if (!valid(1) || !valid(2) || !valid(3) || !valid(4)) {
      if (!processInput || !processInput.value) setStep(1);
      else if (!valid(2)) setStep(2);
      else if (!valid(3)) setStep(3);
      else setStep(4);
      return;
    }
    clearErrors();
    busy = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      var t = submitBtn.querySelector(".btn__text");
      if (t) t.textContent = "Joining...";
    }

    var payload = {
      first_name: (form.first_name && form.first_name.value) || "",
      email: (form.email && form.email.value) || "",
      agency_website: (form.agency_website && form.agency_website.value) || "",
      selected_process: (processInput && processInput.value) || "",
      other_process: (form.other_process && form.other_process.value) || "",
      company_website: (form.company_website && form.company_website.value) || "",
      source_path: location.pathname || "/waitlist",
    };

    try {
      var res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.ok) {
        if (res.status === 404 && globalError) {
          globalError.textContent =
            "Waitlist API not found. Use npm run dev (not Live Server) and restart the dev server if it was already running.";
          globalError.hidden = false;
          setStep(4);
          busy = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            var t404 = submitBtn.querySelector(".btn__text");
            if (t404) t404.textContent = "Join the waitlist";
          }
          return;
        }
        if (data.errors) {
          Object.keys(data.errors).forEach(function (k) {
            err(k, data.errors[k]);
          });
          var keys = Object.keys(data.errors);
          if (keys.indexOf("selected_process") >= 0 || keys.indexOf("other_process") >= 0) setStep(1);
          else if (keys.indexOf("first_name") >= 0) setStep(2);
          else if (keys.indexOf("email") >= 0) setStep(3);
          else setStep(4);
        } else if (globalError) {
          globalError.textContent = data.error || "Something went wrong. Please try again.";
          globalError.hidden = false;
          setStep(4);
        }
        busy = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          var tx = submitBtn.querySelector(".btn__text");
          if (tx) tx.textContent = "Join the waitlist";
        }
        return;
      }
      track();
      setStep(DONE);
    } catch (_) {
      if (globalError) {
        globalError.textContent = "Network error. Check your connection and try again.";
        globalError.hidden = false;
      }
      setStep(4);
    }
    busy = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      var ty = submitBtn.querySelector(".btn__text");
      if (ty) ty.textContent = "Join the waitlist";
    }
  });

  setStep(0);
})();
