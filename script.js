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

    IMask(telefoneInput, maskOptions);

    document.addEventListener("DOMContentLoaded", function() {
        const form = document.getElementById("form");
      
        form.addEventListener("submit", function(e) {
          e.preventDefault(); // Impede o envio padrão do formulário
      
          // Captura os valores dos campos do formulário
          const nome = document.getElementById("nome").value;
          const email = document.getElementById("email").value;
          const telefone = document.getElementById("telefone").value;
          const faturamento = document.getElementById("faturamento").value;
      
          // Cria o objeto payload com os dados a serem enviados
          const payload = {
            nome: nome,
            email: email,
            telefone: telefone,
            faturamento: faturamento
          };
      
          // Envia os dados para o n8n via fetch
          fetch("https://backend.noblecompany.digital/webhook-test/forms_lp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          })
            .then(response => {
              if (response.ok) {
                return response.json(); // ou response.text(), conforme o retorno do seu webhook
              } else {
                throw new Error("Erro ao enviar os dados");
              }
            })
            .then(data => {
              console.log("Dados enviados com sucesso:", data);
              alert("Obrigado! Em breve entraremos em contato.");
              form.reset();
            })
            .catch(error => {
              console.error("Erro:", error);
              alert("Ocorreu um erro ao enviar seus dados. Tente novamente.");
            });
        });
    });
});

