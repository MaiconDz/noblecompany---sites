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

    // Captura o input de telefone (garanta que existe um <input id="telefone" ...> no HTML)
    const telefoneInput = document.getElementById('telefone');

    // Define duas máscaras: uma para fixo e outra para celular
    const maskOptions = {
      mask: [
        { mask: '(00) 0000-0000' },  // para telefone fixo
        { mask: '(00) 00000-0000' }  // para celular
      ],
      // Escolhe a máscara com base na quantidade de dígitos digitados
      dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return number.length > 10 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0];
      }
    };

    // Se o telefoneInput existir no DOM, aplica a máscara
    if (telefoneInput) {
      IMask(telefoneInput, maskOptions);
    }

    // AQUI: Defina a const form para o ID do formulário
    const form = document.getElementById("form");
    const successModal = document.getElementById("success-modal");
    const closeButton = successModal.querySelector(".close-button");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const faturamento = document.getElementById("faturamento").value;

        const payload = {
        nome,
        email,
        telefone,
        faturamento
        };

        fetch("https://webhook.noblecompany.digital/webhook/forms_lp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
        })
        .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error("Erro ao enviar os dados");
        }
        })
        .then(data => {
        console.log("Dados enviados com sucesso:", data);
        // Em vez de alert, exibimos o modal
        successModal.style.display = "block";
        form.reset();
        })
        .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao enviar seus dados. Tente novamente.");
        });
    });

    // Fecha o modal ao clicar no X
    closeButton.addEventListener("click", function() {
        successModal.style.display = "none";
    });

    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", function(event) {
        if (event.target === successModal) {
        successModal.style.display = "none";
        }
    });

    // Logo depois de "DOMContentLoaded", antes de usar faqItems.forEach:
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');
    
        questionBtn.addEventListener('click', () => {
        // Fecha todos os outros items, se quiser efeito "acordeão" exclusivo:
         faqItems.forEach(i => {
           if (i !== item) {
             i.classList.remove('active');
             const iIcon = i.querySelector('.faq-icon');
             if (iIcon) iIcon.textContent = '+';
           }
         });
    
        // Alterna o estado do item atual
        item.classList.toggle('active');
    
        // Ajusta o ícone + ou -
        if (item.classList.contains('active')) {
            icon.textContent = '-';
        } else {
            icon.textContent = '+';
        }
        });
    });
});
