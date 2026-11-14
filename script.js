const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileNavPanel = document.querySelector('.mobile-nav-panel');

if (menuToggle && mobileNavPanel) {
  const setMenuState = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileNavPanel.classList.toggle('is-open', open);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  mobileNavPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = targetId && targetId.startsWith('#') ? document.querySelector(targetId) : null;

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setMenuState(false);
    });
  });
}

const scrollTopBtn = document.querySelector('.scroll-top-btn');
if (scrollTopBtn) {
  const updateTopBtnState = () => {
    const shouldShow = window.scrollY > 12;
    scrollTopBtn.classList.toggle('is-visible', shouldShow);
  };

  updateTopBtnState();
  window.addEventListener('scroll', updateTopBtnState, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = targetId && document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nextField = contactForm.querySelector('input[name="_next"]');
  const emailField = contactForm.querySelector('#email');
  const replyToField = contactForm.querySelector('input[name="_replyto"]');
  const runtimeNote = document.querySelector('.contact-runtime-note');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const isFileProtocol = window.location.protocol === 'file:';

  const syncReplyTo = () => {
    if (emailField && replyToField) {
      replyToField.value = emailField.value.trim();
    }
  };

  if (emailField && replyToField) {
    emailField.addEventListener('input', syncReplyTo);
    emailField.addEventListener('blur', syncReplyTo);
  }

  if (isFileProtocol) {
    if (runtimeNote) {
      runtimeNote.hidden = false;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'ローカルファイルでは送信できません';
      submitButton.style.opacity = '0.7';
      submitButton.style.cursor = 'not-allowed';
    }

    contactForm.addEventListener('submit', (event) => {
      syncReplyTo();
      event.preventDefault();
    });
  } else if (nextField) {
    nextField.value = new URL('./thanks.html', window.location.href).href;

    contactForm.addEventListener('submit', () => {
      syncReplyTo();
    });
  }
}
