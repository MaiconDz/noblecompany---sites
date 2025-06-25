document.addEventListener("DOMContentLoaded", () => {
  // Código para o menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      menuToggle.classList.toggle("active")
    })
  }

  // Fechar menu ao clicar em um link
  const navItems = document.querySelectorAll(".nav-links a")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active")
        menuToggle.classList.remove("active")
      }
    })
  })

  // Detecta o tipo de navegação
  const navEntries = performance.getEntriesByType("navigation")
  const navigationType = navEntries.length > 0 ? navEntries[0].type : null

  // Se for um refresh e houver hash, remove o hash e força o scroll para o topo
  if (navigationType === "reload" && window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search)
    window.scrollTo(0, 0)
  }

  // Adiciona efeito de scroll suave para todos os links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Calcula a posição considerando o header fixo
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Captura o input de telefone (garanta que existe um <input id="telefone" ...> no HTML)
  const telefoneInput = document.getElementById("telefone")

  // Define duas máscaras: uma para fixo e outra para celular
  const maskOptions = {
    mask: [
      { mask: "(00) 0000-0000" }, // para telefone fixo
      { mask: "(00) 00000-0000" }, // para celular
    ],
    // Escolhe a máscara com base na quantidade de dígitos digitados
    dispatch: (appended, dynamicMasked) => {
      const number = (dynamicMasked.value + appended).replace(/\D/g, "")
      return number.length > 10 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0]
    },
  }

  // Se o telefoneInput existir no DOM, aplica a máscara
  if (telefoneInput) {
    const IMask = window.IMask // Declara IMask para evitar o erro
    IMask(telefoneInput, maskOptions)
  }

  // AQUI: Defina a const form para o ID do formulário
  const form = document.getElementById("form")
  const successModal = document.getElementById("success-modal")
  const closeButton = successModal.querySelector(".close-button")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const telefone = document.getElementById("telefone").value
    const nicho = document.getElementById("nicho").value
    const faturamento = document.getElementById("faturamento").value

    const payload = {
      nome,
      email,
      telefone,
      nicho,
      faturamento,
    }

    // Adiciona classe de loading ao botão
    const submitButton = form.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent
    submitButton.textContent = "Enviando..."
    submitButton.disabled = true
    submitButton.style.opacity = "0.7"

    fetch("https://webhook.noblecompany.digital/webhook/forms_lp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          fbq('track', 'Lead'); // Envia o evento Lead para o Facebook Pixel
          return response.json()
        } else {
          throw new Error("Erro ao enviar os dados")
        }
      })
      .then((data) => {
        console.log("Dados enviados com sucesso:", data)
        // Em vez de alert, exibimos o modal com animação
        successModal.style.display = "block"
        // Força um reflow para que a transição funcione
        successModal.offsetWidth
        successModal.classList.add("show")
        form.reset()
      })
      .catch((error) => {
        console.error("Erro:", error)
        alert("Ocorreu um erro ao enviar seus dados. Tente novamente.")
      })
      .finally(() => {
        // Restaura o botão
        submitButton.textContent = originalText
        submitButton.disabled = false
        submitButton.style.opacity = "1"
      })
  })

  // Fecha o modal ao clicar no X
  closeButton.addEventListener("click", () => {
    successModal.classList.remove("show")
    setTimeout(() => {
      successModal.style.display = "none"
    }, 300) // Tempo da transição
  })

  // Fecha o modal ao clicar fora do conteúdo
  window.addEventListener("click", (event) => {
    if (event.target === successModal) {
      successModal.classList.remove("show")
      setTimeout(() => {
        successModal.style.display = "none"
      }, 300) // Tempo da transição
    }
  })

  // Logo depois de "DOMContentLoaded", antes de usar faqItems.forEach:
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question")
    const icon = item.querySelector(".faq-icon")

    questionBtn.addEventListener("click", () => {
      // Fecha todos os outros items, se quiser efeito "acordeão" exclusivo:
      faqItems.forEach((i) => {
        if (i !== item) {
          i.classList.remove("active")
          const iIcon = i.querySelector(".faq-icon")
          if (iIcon) iIcon.textContent = "+"
        }
      })

      // Alterna o estado do item atual
      item.classList.toggle("active")

      // Ajusta o ícone + ou -
      if (item.classList.contains("active")) {
        icon.textContent = "-"
      } else {
        icon.textContent = "+"
      }
    })
  })

  // Adiciona animação aos elementos quando eles entram na viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".problem-text-item, .method-image, .benefits_img_container, .product-image-container, .about-text",
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 100) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    })
  }

  // Inicializa os elementos como invisíveis se não estiverem na classe problem-text-item
  document
    .querySelectorAll(".method-image, .benefits_img_container, .product-image-container, .about-text")
    .forEach((element) => {
      if (!element.classList.contains("problem-text-item")) {
        element.style.opacity = "0"
        element.style.transform = "translateY(20px)"
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
      }
    })

  // Executa a função quando a página carrega e quando o usuário rola
  window.addEventListener("load", animateOnScroll)
  window.addEventListener("scroll", animateOnScroll)

  // Adiciona efeito de header reduzido ao rolar
  const header = document.querySelector("header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.padding = "10px 30px"
    } else {
      header.style.padding = "20px 30px"
    }
  })
})