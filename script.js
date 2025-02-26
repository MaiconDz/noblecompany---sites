document.addEventListener("DOMContentLoaded", function() {
    // Código para o menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    }

    // Detecta o tipo de navegação
    const navEntries = performance.getEntriesByType("navigation");
    const navigationType = navEntries.length > 0 ? navEntries[0].type : null;

    // Se for um refresh e houver hash, remove o hash e força o scroll para o topo
    if (navigationType === "reload" && window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
    }
});

