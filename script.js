document.addEventListener("DOMContentLoaded", () => {
	/** MOBILE MENU */
	const hamburgerBtn = document.querySelector(".hamburger");
	const navWrapper = document.querySelector(".nav-wrapper");
	const navLinks = document.querySelectorAll("nav a");

	hamburgerBtn.addEventListener("click", () => {
		navWrapper.classList.toggle("active");
		const icon = hamburgerBtn.querySelector("i");
		if (icon.classList.contains("fa-bars")) {
			icon.classList.remove("fa-bars");
			icon.classList.add("fa-times");
		} else {
			icon.classList.remove("fa-times");
			icon.classList.add("fa-bars");
		}
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (navWrapper.classList.contains("active")) {
				navWrapper.classList.remove("active");
				const icon = hamburgerBtn.querySelector("i");
				icon.classList.remove("fa-times");
				icon.classList.add("fa-bars");
			}
		});
	});

	/** END MOBILE MENU */

	// --- LÓGICA PARA ANIMAÇÃO AO ROLAR A PÁGINA ---
	const revealElements = document.querySelectorAll(".reveal");

	const revealOnScroll = () => {
		const windowHeight = window.innerHeight;
		for (let i = 0; i < revealElements.length; i++) {
			const elementTop = revealElements[i].getBoundingClientRect().top;
			const elementVisible = 150;

			if (elementTop < windowHeight - elementVisible) {
				revealElements[i].classList.add("visible");
			}
		}
	};

	window.addEventListener("scroll", revealOnScroll);
	revealOnScroll();
	
	// --- LANGUAGE SWITCH ---
	const langToggleBtn = document.getElementById("lang-toggle");
	let currentLang = "pt";

	const setLanguage = async (lang) => {
		try {
			const response = await fetch(`assets/data/${lang}.json`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const translations = await response.json();

			const elements = document.querySelectorAll("[data-translate-key]");
			elements.forEach((element) => {
				const key = element.getAttribute("data-translate-key");
				if (translations[key]) {
					element.innerHTML = translations[key];
				}
			});

			document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
			langToggleBtn.textContent = lang === "pt" ? "EN" : "PT-BR";
			currentLang = lang;
		} catch (error) {
			console.error("Failed to load translation:", error);
		}
	};

	langToggleBtn.addEventListener("click", () => {
		const newLang = currentLang === "pt" ? "en" : "pt";
		setLanguage(newLang);
	});

	setLanguage(currentLang);
});
