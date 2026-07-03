const buttons = document.querySelectorAll("[data-target]");
const cards = document.querySelectorAll(".offer-card");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".mockup-panel");
const briefForm = document.querySelector(".brief-form");
const briefOutput = document.querySelector(".brief-output");
const validOffers = ["automatizacion", "web", "contenido"];

function selectOffer(target, options = {}) {
  if (!validOffers.includes(target)) return;

  cards.forEach((card) => card.classList.toggle("active", card.dataset.offer === target));
  tabs.forEach((tab) => {
    const isActive = tab.dataset.target === target;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });
  panels.forEach((panel) => {
    const isActive = panel.id === `mockup-${target}`;
    panel.classList.toggle("is-visible", isActive);
    panel.hidden = !isActive;
  });

  if (options.syncUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("offer", target);
    window.history.replaceState({}, "", url);
  }

  if (options.focusTab) {
    document.querySelector(`#tab-${target}`)?.focus();
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOfferCardButton = button.classList.contains("offer-button");
    selectOffer(button.dataset.target, { syncUrl: true });
    if (isOfferCardButton) {
      document.querySelector("#demo").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

tabs.forEach((tab, index) => {
  tab.addEventListener("keydown", (event) => {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;

    event.preventDefault();
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    const nextTarget = tabs[nextIndex].dataset.target;
    selectOffer(nextTarget, { syncUrl: true, focusTab: true });
  });
});

briefForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(briefForm);
  const businessType = data.get("business_type")?.toString().trim() || "negocio de servicios";
  const manualTask = data.get("manual_task")?.toString().trim() || "seguimiento manual entre WhatsApp, Excel y correo";
  const channel = data.get("channel")?.toString().trim() || "WhatsApp";

  briefOutput.textContent = `Resumen inicial: ${businessType}. Flujo a revisar: ${manualTask}. Canal preferido: ${channel}. Siguiente paso sugerido: diagnostico de 30 minutos para mapear entrada, reglas, responsables, salida y metrica de exito.`;
});

const initialOffer = new URLSearchParams(window.location.search).get("offer");
selectOffer(validOffers.includes(initialOffer) ? initialOffer : "automatizacion");
