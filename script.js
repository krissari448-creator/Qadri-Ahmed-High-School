document.addEventListener('DOMContentLoaded', () => {

    const initParticleCanvas = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            opacity: 0.45;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.7 + 0.3
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#D4AF37';
                ctx.fill();
            });
            requestAnimationFrame(render);
        };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        render();
    };

    const handleHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.padding = '0.5rem 5%';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
                header.style.background = 'rgba(11, 19, 43, 0.96)';
            } else {
                header.style.padding = '0.8rem 5%';
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(11, 19, 43, 0.88)';
            }
        });
    };

    const initScrollSpy = () => {
        const navLinks = document.querySelectorAll('header nav a');
        const sections = document.querySelectorAll('main section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const isMatch = link.getAttribute('href') === `#${id}`;
                        link.style.color = isMatch ? 'var(--gold-primary)' : 'var(--text-main)';
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sec => observer.observe(sec));
    };

    const initScrollReveal = () => {
        const elementsToAnimate = document.querySelectorAll('article, #faq details, #contact form, #hero');

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, idx * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => revealObserver.observe(el));
    };

    const initAccordionBehavior = () => {
        const detailsElements = document.querySelectorAll('#faq details');

        detailsElements.forEach(detail => {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    detailsElements.forEach(otherDetail => {
                        if (otherDetail !== detail && otherDetail.open) {
                            otherDetail.open = false;
                        }
                    });
                }
            });
        });
    };

    const initFormInteractivity = () => {
        const form = document.querySelector('#contact form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('input[type="text"]').value;
            const submitBtn = form.querySelector('button[type="submit"]');

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                form.reset();

                showToast(`Thank you, ${nameInput}! Your inquiry has been sent to the administration.`);
            }, 1200);
        });
    };

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1C2541;
            color: #F3E5AB;
            border: 1px solid #D4AF37;
            padding: 16px 24px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-size: 0.95rem;
            z-index: 2000;
            transform: translateY(50px);
            opacity: 0;
            transition: all 0.4s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(50px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    const initBackToTop = () => {
        const btn = document.createElement('button');
        btn.innerHTML = '&#8593;';
        btn.setAttribute('aria-label', 'Back to top');
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 45px;
            height: 45px;
            background: rgba(28, 37, 65, 0.9);
            color: #D4AF37;
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#D4AF37';
            btn.style.color = '#0B132B';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(28, 37, 65, 0.9)';
            btn.style.color = '#D4AF37';
        });
    };

    initParticleCanvas();
    handleHeaderScroll();
    initScrollSpy();
    initScrollReveal();
    initAccordionBehavior();
    initFormInteractivity();
    initBackToTop();
});