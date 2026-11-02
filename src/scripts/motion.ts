import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initMotion() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	gsap.registerPlugin(ScrollTrigger);

	const q = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));
	const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	// --- Entrance (on load) ---
	gsap.from('[data-anim="hero-line"]', { y: 90, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 });
	gsap.from('[data-anim="hero-sub"]', { y: 40, opacity: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' });
	gsap.from('[data-anim="note"]', { y: -90, rotation: -9, opacity: 0, duration: 1.1, delay: 0.5, ease: 'back.out(1.5)' });

	// --- Scroll: giant "5" scrubbed over the hero ---
	const hero = document.querySelector('[data-anim="hero"]');
	if (hero) {
		gsap.to('[data-anim="big5"]', {
			y: 200,
			rotation: -5,
			ease: 'none',
			scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
		});
	}

	// --- Scroll: ghost words + wall pieces parallax ---
	q('[data-parallax]').forEach((el) => {
		const amt = parseFloat(el.getAttribute('data-parallax') || '50');
		gsap.fromTo(
			el,
			{ y: amt },
			{
				y: -amt,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
			}
		);
	});

	// --- Scroll: section heading reveals ---
	q('[data-reveal]').forEach((el) => {
		gsap.from(el, {
			y: 54,
			opacity: 0,
			duration: 0.9,
			ease: 'power3.out',
			scrollTrigger: { trigger: el, start: 'top 88%' },
		});
	});

	// --- Scroll: staggered card/row groups ---
	q('[data-stagger]').forEach((group) => {
		gsap.from(Array.from(group.children) as HTMLElement[], {
			y: 64,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.07,
			scrollTrigger: { trigger: group, start: 'top 84%' },
		});
	});

	// --- Scroll: poster tiles drift ---
	const tilesRow = document.querySelector('[data-tiles]');
	q('[data-drift]').forEach((el, i) => {
		gsap.to(el, {
			y: i % 2 ? 40 : -40,
			ease: 'none',
			scrollTrigger: { trigger: tilesRow || el, start: 'top bottom', end: 'bottom top', scrub: true },
		});
	});

	if (canHover) {
		// --- Hover: poster tile lift ---
		q('[data-tile]').forEach((el) => {
			const rot = gsap.getProperty(el, 'rotation') as number;
			el.addEventListener('mouseenter', () =>
				gsap.to(el, { scale: 1.05, rotation: 0, zIndex: 20, duration: 0.45, ease: 'power3.out' })
			);
			el.addEventListener('mouseleave', () =>
				gsap.to(el, { scale: 1, rotation: rot, zIndex: 1, duration: 0.55, ease: 'power3.out' })
			);
		});

		// --- Hover: rule row number ---
		q('[data-rule]').forEach((row) => {
			const num = row.querySelector<HTMLElement>('[data-rule-num]');
			if (!num) return;
			gsap.set(num, { transformOrigin: 'left center' });
			row.addEventListener('mouseenter', () => gsap.to(num, { x: 10, scale: 1.14, duration: 0.35, ease: 'power3.out' }));
			row.addEventListener('mouseleave', () => gsap.to(num, { x: 0, scale: 1, duration: 0.4, ease: 'power3.out' }));
		});

		// --- Buttons: fill sweep + magnetic pull ---
		q('[data-btn]').forEach((btn) => {
			const fill = btn.querySelector<HTMLElement>('[data-fill]');
			const label = btn.querySelector<HTMLElement>('[data-label]');
			const arrow = btn.querySelector<HTMLElement>('[data-arrow]');
			const base = label ? getComputedStyle(label).color : null;
			const hov = btn.getAttribute('data-hover-color') || '#f2ece1';

			if (fill) gsap.set(fill, { yPercent: 101 });

			btn.addEventListener('mouseenter', () => {
				if (fill) gsap.to(fill, { yPercent: 0, duration: 0.42, ease: 'power3.out', overwrite: true });
				if (label) gsap.to(label, { color: hov, duration: 0.28 });
				if (arrow) gsap.to(arrow, { x: 9, color: hov, duration: 0.4, ease: 'power3.out' });
			});
			btn.addEventListener('mouseleave', () => {
				if (fill)
					gsap.to(fill, {
						yPercent: -101,
						duration: 0.38,
						ease: 'power3.in',
						overwrite: true,
						onComplete: () => gsap.set(fill, { yPercent: 101 }),
					});
				if (label && base) gsap.to(label, { color: base, duration: 0.28 });
				if (arrow) gsap.to(arrow, { x: 0, color: base, duration: 0.4, ease: 'power3.out' });
				gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
			});
			btn.addEventListener('mousemove', (e: MouseEvent) => {
				const r = btn.getBoundingClientRect();
				gsap.to(btn, {
					x: (e.clientX - r.left - r.width / 2) * 0.18,
					y: (e.clientY - r.top - r.height / 2) * 0.22,
					duration: 0.4,
					ease: 'power2.out',
				});
			});
		});
	}

	// --- Marquee skew driven by scroll velocity ---
	const marq = q('[data-marq]');
	if (marq.length) {
		ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate: (self) => {
				const v = gsap.utils.clamp(-14, 14, self.getVelocity() / 200);
				gsap.to(marq, { skewX: v, duration: 0.45, ease: 'power2.out', overwrite: true });
			},
		});
	}

	// --- Custom cursor (pointer: fine only) ---
	const cursor = document.querySelector<HTMLElement>('[data-cursor]');
	if (cursor && canHover) {
		const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' });
		const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' });
		window.addEventListener('mousemove', (e) => {
			xTo(e.clientX);
			yTo(e.clientY);
			gsap.to(cursor, { opacity: 1, duration: 0.25, overwrite: 'auto' });
		});
		window.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.25 }));
		q('a, button, [data-tile], [data-rule], .photo').forEach((el) => {
			el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.8, opacity: 0.4, duration: 0.3 }));
			el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 }));
		});
	}

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(() => ScrollTrigger.refresh());
	}
	setTimeout(() => ScrollTrigger.refresh(), 1200);
}
