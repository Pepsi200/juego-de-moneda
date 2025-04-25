// JavaScript extraído de index.html
let heads = 0, tails = 0, streak = 0, lastResult = '', lang = 'es';
const streakMsgs = {
    es: ['¡Racha de ', ' veces seguidas!'],
    en: ['Streak of ', ' times in a row!']
};
const labels = {
    es: { cara: 'Cara', cruz: 'Cruz', lanzar: 'Lanzar moneda', reiniciar: 'Reiniciar', idioma: 'Idioma', heads: 'Cara', tails: 'Cruz' },
    en: { cara: 'Heads', cruz: 'Tails', lanzar: 'Flip coin', reiniciar: 'Reset', idioma: 'Language', heads: 'Heads', tails: 'Tails' }
};
function loadState() {
    const saved = JSON.parse(localStorage.getItem('coinState'));
    if (saved) {
        heads = saved.heads; tails = saved.tails; streak = saved.streak; lastResult = saved.lastResult; lang = saved.lang || 'es';
        document.getElementById('langSelect').value = lang;
    }
    updateCounters();
}
function saveState() {
    localStorage.setItem('coinState', JSON.stringify({ heads, tails, streak, lastResult, lang }));
}
function updateCounters() {
    document.getElementById('headsCount').textContent = `${labels[lang].heads}: ${heads}`;
    document.getElementById('tailsCount').textContent = `${labels[lang].tails}: ${tails}`;
    document.getElementById('flipBtn').textContent = labels[lang].lanzar;
    document.getElementById('resetBtn').textContent = labels[lang].reiniciar;
    document.querySelector('label[for="langSelect"]').textContent = labels[lang].idioma + ':';
}
function changeLang() {
    lang = document.getElementById('langSelect').value;
    updateCounters();
    saveState();
    const res = document.getElementById('result').textContent;
    if (res === 'Cara' || res === 'Heads') document.getElementById('result').textContent = labels[lang].cara;
    if (res === 'Cruz' || res === 'Tails') document.getElementById('result').textContent = labels[lang].cruz;
}
function flipCoin() {
    const isHeads = Math.random() < 0.5;
    const resultText = isHeads ? labels[lang].cara : labels[lang].cruz;
    const imgSrc = isHeads ? 'resources/heads.svg' : 'resources/tails.svg';
    const coinImg = document.getElementById('coinImg');
    coinImg.style.transition = 'transform 0.8s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.4s';
    coinImg.style.transform = 'rotateY(1440deg) scale(1.15)';
    coinImg.classList.add('coin-anim');
    setTimeout(() => {
        coinImg.src = imgSrc;
        coinImg.style.transform = 'rotateY(0deg) scale(1)';
        coinImg.classList.remove('coin-anim');
    }, 400);
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = resultText;
    resultDiv.classList.remove('fade-in');
    void resultDiv.offsetWidth;
    resultDiv.classList.add('fade-in');
    if ((isHeads && lastResult === 'heads') || (!isHeads && lastResult === 'tails')) {
        streak++;
    } else {
        streak = 1;
    }
    lastResult = isHeads ? 'heads' : 'tails';
    if (isHeads) heads++; else tails++;
    updateCounters();
    const streakMsg = document.getElementById('streakMsg');
    if (streak >= 3) {
        streakMsg.textContent = streakMsgs[lang][0] + streak + streakMsgs[lang][1];
        streakMsg.classList.remove('fade-in');
        void streakMsg.offsetWidth;
        streakMsg.classList.add('fade-in');
    } else {
        streakMsg.textContent = '';
    }
    saveState();
    updateStatsBar();
}

function updateStatsBar() {
    const total = heads + tails;
    const headsPercent = total ? (heads / total) * 100 : 50;
    const tailsPercent = total ? (tails / total) * 100 : 50;
    document.getElementById('headsBar').style.width = headsPercent + '%';
    document.getElementById('tailsBar').style.width = tailsPercent + '%';
    document.getElementById('headsBar').textContent = headsPercent.toFixed(0) + '%';
    document.getElementById('tailsBar').textContent = tailsPercent.toFixed(0) + '%';
}

function resetCounters() {
    heads = 0; tails = 0; streak = 0; lastResult = '';
    document.getElementById('result').textContent = '\u00A0';
    document.getElementById('streakMsg').textContent = '';
    updateCounters();
    saveState();
    updateStatsBar();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
        document.getElementById('flipBtn').focus();
        flipCoin();
    }
});

loadState();
updateStatsBar();
