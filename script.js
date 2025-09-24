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
});
