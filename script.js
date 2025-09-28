document.addEventListener("DOMContentLoaded", () => {
	/**
	 * LÓGICA PARA REDIRECIONAR ROTAS INEXISTENTES (SPA)
	 */
	(function handleSPARouting() {
		const path = window.location.pathname;
		const isRoot = path === "/" || path.endsWith("/index.html");
		if (!isRoot && !window.location.hash) {
			console.warn(`Redirecionando da rota inexistente "${path}" para a raiz.`);
			window.location.href = "/";
		}
	})();
	
	/**
	 * LÓGICA PARA O MENU HAMBÚRGUER (MOBILE)
	 */
	const hamburgerBtn = document.querySelector(".hamburger");
	const navWrapper = document.querySelector(".nav-wrapper");
	const navLinks = document.querySelectorAll("nav a");

	hamburgerBtn.addEventListener("click", () => {
		navWrapper.classList.toggle("active");
		const icon = hamburgerBtn.querySelector("svg");
		icon.classList.toggle("fa-bars");
		icon.classList.toggle("fa-xmark");
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (navWrapper.classList.contains("active")) {
				navWrapper.classList.remove("active");
				const icon = hamburgerBtn.querySelector("i");
				icon.classList.remove("fa-xmark");
				icon.classList.add("fa-bars");
			}
		});
	});

	/**
	 * LÓGICA PARA ANIMAÇÃO AO ROLAR A PÁGINA (SCROLL REVEAL)
	 */
	const revealElements = document.querySelectorAll(".reveal");
	const revealOnScroll = () => {
		const windowHeight = window.innerHeight;
		revealElements.forEach((el) => {
			const elementTop = el.getBoundingClientRect().top;
			if (elementTop < windowHeight - 150) {
				el.classList.add("visible");
			}
		});
	};
	window.addEventListener("scroll", revealOnScroll);
	revealOnScroll();

	/**
	 * LÓGICA PARA PROJETOS, PAGINAÇÃO E IDIOMA
	 */
	const langToggleBtn = document.getElementById("lang-toggle");

	let currentLang = "pt";
	let allProjects = [];
	let currentPage = 1;
	const projectsPerPage = 3;

	const projectsGrid = document.querySelector(".projects-grid");
	const paginationControls = document.getElementById("pagination-controls");

	const setupPagination = () => {
		paginationControls.innerHTML = "";
		const totalPages = Math.ceil(allProjects.length / projectsPerPage);
		if (totalPages <= 1) return;

		const prevButton = document.createElement("button");
		prevButton.innerHTML = "&laquo;";
		prevButton.disabled = currentPage === 1;
		prevButton.addEventListener("click", () => {
			if (currentPage > 1) {
				currentPage--;
				displayPage(currentPage);
			}
		});
		paginationControls.appendChild(prevButton);

		for (let i = 1; i <= totalPages; i++) {
			const pageButton = document.createElement("button");
			pageButton.innerText = i;
			if (i === currentPage) {
				pageButton.classList.add("active");
			}
			pageButton.addEventListener("click", () => {
				currentPage = i;
				displayPage(currentPage);
			});
			paginationControls.appendChild(pageButton);
		}

		const nextButton = document.createElement("button");
		nextButton.innerHTML = "&raquo;";
		nextButton.disabled = currentPage === totalPages;
		nextButton.addEventListener("click", () => {
			if (currentPage < totalPages) {
				currentPage++;
				displayPage(currentPage);
			}
		});
		paginationControls.appendChild(nextButton);
	};

	const displayPage = (page) => {
		projectsGrid.innerHTML = "";
		const startIndex = (page - 1) * projectsPerPage;
		const endIndex = startIndex + projectsPerPage;
		const paginatedProjects = allProjects.slice(startIndex, endIndex);

		paginatedProjects.forEach((project) => {
			const tagsHtml = project.tags
				.map((tag) => `<span class="tag">${tag}</span>`)
				.join("");
			const projectCardHtml = `
        <article class="project-card">
          <img src="${project.pictures[0]}" alt="Imagem do projeto ${project.name}" class="project-image">
          <div class="project-content">
            <h3>${project.name}</h3>
            <p class="summary">${project.summary}</p>
            <div class="project-tags">${tagsHtml}</div>
            <div class="project-links">
              <a href="${project.projectLink}" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-github"></i> Github
              </a>
            </div>
          </div>
        </article>
      `;
			projectsGrid.innerHTML += projectCardHtml;
		});
		setupPagination();
	};

	const loadProjects = async (lang) => {
		try {
			const response = await fetch(`assets/data/projects-${lang}.json`);
			if (!response.ok) throw new Error("Arquivo de projetos não encontrado");
			allProjects = await response.json();
			currentPage = 1;
			displayPage(currentPage);
		} catch (error) {
			console.error("Falha ao carregar os projetos:", error);
			projectsGrid.innerHTML = `<p style="text-align:center;">Erro ao carregar projetos. Tente novamente mais tarde.</p>`;
		}
	};

	const setLanguage = async (lang) => {
		try {
			const response = await fetch(`assets/data/${lang}.json`);
			if (!response.ok) throw new Error("Arquivo de tradução não encontrado");
			const translations = await response.json();

			document.querySelectorAll("[data-translate-key]").forEach((el) => {
				const key = el.getAttribute("data-translate-key");
				if (translations[key]) el.innerHTML = translations[key];
			});

			await loadProjects(lang);

			document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
			const langText = lang === "pt" ? "EN" : "PT-BR";
			langToggleBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${langText}`;
			currentLang = lang;
		} catch (error) {
			console.error("Falha ao carregar tradução:", error);
		}
	};

	langToggleBtn.addEventListener("click", () => {
		const newLang = currentLang === "pt" ? "en" : "pt";
		setLanguage(newLang);
	});

	setLanguage(currentLang);

	/**
	 * LÓGICA PARA VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
	 */
	const contactForm = document.getElementById("contact-form");

	contactForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const name = document.getElementById("name");
		const email = document.getElementById("email");
		const message = document.getElementById("message");
		let isValid = true;

		const showError = (input, errorMessage) => {
			input.classList.add("invalid");
			const errorP = input.nextElementSibling;
			errorP.innerText = errorMessage;
		};

		const clearError = (input) => {
			input.classList.remove("invalid");
			const errorP = input.nextElementSibling;
			errorP.innerText = "";
		};

		if (name.value.trim() === "") {
			showError(name, "O campo nome é obrigatório.");
			isValid = false;
		} else {
			clearError(name);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email.value.trim() === "") {
			showError(email, "O campo email é obrigatório.");
			isValid = false;
		} else if (!emailRegex.test(email.value)) {
			showError(email, "Por favor, insira um email válido.");
			isValid = false;
		} else {
			clearError(email);
		}

		if (message.value.trim() === "") {
			showError(message, "O campo mensagem é obrigatório.");
			isValid = false;
		} else {
			clearError(message);
		}

		if (isValid) {
			const formData = new FormData(contactForm);
			const submitButton = contactForm.querySelector('button[type="submit"]');
			const originalButtonText = submitButton.innerHTML;
			submitButton.innerHTML = "Enviando...";
			submitButton.disabled = true;

			try {
				const response = await fetch(contactForm.action, {
					method: "POST",
					body: formData,
					headers: {
						Accept: "application/json",
					},
				});

				if (response.ok) {
					alert("Mensagem enviada com sucesso! Obrigado pelo contato.");
					contactForm.reset();
				} else {
					throw new Error("Falha no envio da mensagem.");
				}
			} catch (error) {
				alert(
					"Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde."
				);
			} finally {
				submitButton.innerHTML = originalButtonText;
				submitButton.disabled = false;
			}
		}
	});

	/** LÓGICA PARA TROCA DE TEMA */
	const themeToggleBtn = document.getElementById("theme-toggle");

	const setTheme = (theme) => {
		const themeIcon = themeToggleBtn.querySelector("i, svg");
		document.body.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);

		if (theme === "dark") {
			themeIcon.classList.remove("fa-moon");
			themeIcon.classList.add("fa-sun");
		} else {
			themeIcon.classList.remove("fa-sun");
			themeIcon.classList.add("fa-moon");
		}
	};

	const systemPrefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;
	const savedTheme = localStorage.getItem("theme");

	const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
	setTheme(initialTheme);

	themeToggleBtn.addEventListener("click", () => {
		const currentTheme = document.body.getAttribute("data-theme");
		setTheme(currentTheme === "dark" ? "light" : "dark");
	});
});
