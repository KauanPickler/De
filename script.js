// Elementos do DOM
const heartsContainer = document.getElementById('heartsContainer');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const successOverlay = document.getElementById('successOverlay');
const heartExplosion = document.getElementById('heartExplosion');

// Emojis de corações para usar
const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '🩷', '💜', '🧡'];

// Criar corações caindo
function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    // Posição horizontal aleatória
    heart.style.left = Math.random() * 100 + '%';

    // Tamanho aleatório
    const size = Math.random() * 20 + 15;
    heart.style.fontSize = size + 'px';

    // Duração da animação aleatória
    const duration = Math.random() * 3 + 4;
    heart.style.animationDuration = duration + 's';

    // Delay aleatório
    heart.style.animationDelay = Math.random() * 2 + 's';

    heartsContainer.appendChild(heart);

    // Remover após a animação
    setTimeout(() => {
        heart.remove();
    }, (duration + 2) * 1000);
}

// Criar corações continuamente
setInterval(createFallingHeart, 300);

// Criar alguns corações iniciais
for (let i = 0; i < 10; i++) {
    setTimeout(createFallingHeart, i * 200);
}

// Botão NÃO - foge do mouse/toque
function moveNoButton(e) {
    const button = btnNo;
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();

    // Área segura dentro do card
    const padding = 20;
    const maxX = cardRect.width - button.offsetWidth - padding;
    const maxY = cardRect.height - button.offsetHeight - padding;

    // Nova posição aleatória
    let newX = Math.random() * maxX;
    let newY = Math.random() * (maxY / 2) + cardRect.height / 2;

    // Garantir que não saia da área
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(cardRect.height / 2, Math.min(newY, maxY + 100));

    // Aplicar posição absoluta
    button.style.position = 'absolute';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.transition = 'all 0.2s ease';

    // Aumentar o botão SIM a cada tentativa de clicar no NÃO
    const currentScale = parseFloat(btnYes.dataset.scale) || 1;
    const newScale = Math.min(currentScale + 0.1, 1.5);
    btnYes.dataset.scale = newScale;
    btnYes.style.transform = `scale(${newScale})`;
}

// Eventos para o botão NÃO
btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton(e);
}, { passive: false });
btnNo.addEventListener('click', function(e) {
    e.preventDefault();
    moveNoButton(e);
});

// Botão SIM - mostrar tela de sucesso
btnYes.addEventListener('click', function() {
    successOverlay.classList.add('show');

    // Criar explosão de corações
    createHeartExplosion();

    // Continuar criando corações
    setInterval(createHeartExplosion, 2000);
});

// Explosão de corações na tela de sucesso
function createHeartExplosion() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

            // Posição central
            heart.style.left = 50 + (Math.random() - 0.5) * 80 + '%';
            heart.style.top = 50 + (Math.random() - 0.5) * 80 + '%';

            // Direção aleatória
            const angle = Math.random() * 360;
            const distance = Math.random() * 300 + 100;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;

            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');

            heart.style.animation = `explodeCustom 2s ease-out forwards`;

            heartExplosion.appendChild(heart);

            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

// Adicionar animação customizada via CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes explodeCustom {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(-50% + var(--tx, 0px)),
                calc(-50% + var(--ty, 0px))
            ) scale(1.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Efeito de toque no botão SIM
btnYes.addEventListener('touchstart', function() {
    this.style.transform = 'scale(1.05)';
});

btnYes.addEventListener('touchend', function() {
    const scale = parseFloat(this.dataset.scale) || 1;
    this.style.transform = `scale(${scale})`;
});
