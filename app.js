/* ============================================
   QUIZ PLDC - Application Logic (Gamification & Shop)
   ============================================ */

(function () {
    'use strict';

    // ===== THEME SHOP DATA =====
    const THEME_SHOP = [
        { id: 'light',     name: 'Sáng Cơ Bản',   emoji: '☀️', desc: 'Giao diện sáng tối giản, mặc định',          price: 0,    previewBg: 'linear-gradient(-45deg, #ffc3a0, #ffafbd, #a1c4fd, #c2e9fb)' },
        { id: 'dark',      name: 'Tối Cơ Bản',     emoji: '🌙', desc: 'Giao diện tối sang trọng, dễ nhìn',           price: 0,    previewBg: 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f172a)' },
        { id: 'pastel',    name: 'Soft Pastel',     emoji: '🌈', desc: 'Màu sắc nhẹ nhàng, tinh tế và dịu mắt',     price: 100,  previewBg: 'linear-gradient(135deg, #dbeafe, #e0e7ff, #f3e8ff)' },
        { id: 'sakura',    name: 'Hoa Anh Đào',     emoji: '🌸', desc: 'Sắc hồng lãng mạn như mùa xuân Nhật Bản',   price: 300,  previewBg: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)' },
        { id: 'cyberpunk', name: 'Cyberpunk',        emoji: '⚡', desc: 'Không gian ngầm tương lai, neon vàng sắc bén',price: 500,  previewBg: 'linear-gradient(135deg, #000, #111, #1a1a00)' },
        { id: 'candy',     name: 'Kẹo Ngọt',        emoji: '🍭', desc: 'Sắc màu kẹo ngọt ngào, trẻ trung và vui nhộn', price: 400,  previewBg: 'linear-gradient(-45deg, #ff9de2, #ffc7e6, #b9b3ff, #b5ecff)' },
        { id: 'ocean',     name: 'Đại Dương',        emoji: '🌊', desc: 'Xanh thẳm như lòng biển cả, yên bình',       price: 450,  previewBg: 'linear-gradient(-45deg, #0a1628, #0d2137, #0c3354, #0a4a6e)' },
        { id: 'forest',    name: 'Rừng Xanh',        emoji: '🌲', desc: 'Tĩnh lặng như rừng già, tươi mát và dịu dàng', price: 350,  previewBg: 'linear-gradient(-45deg, #071f12, #0a2e1a, #0d4025, #0a5a30)' },
        { id: 'sunset',    name: 'Hoàng Hôn',        emoji: '🌅', desc: 'Đỏ cam rực lửa của buổi hoàng hôn tráng lệ', price: 400,  previewBg: 'linear-gradient(-45deg, #1a0510, #3b0d1a, #6b1e35, #ff6b35)' },
        { id: 'galaxy',    name: 'Dải Ngân Hà',      emoji: '🌌', desc: 'Du hành vào vũ trụ, ánh tím huyền bí xa xôi', price: 700,  previewBg: 'linear-gradient(-45deg, #020010, #0d001f, #1a0035, #050025)' },
        { id: 'mint',      name: 'Bạc Hà',           emoji: '🌿', desc: 'Mát lạnh như làn gió bạc hà tinh khiết',     price: 250,  previewBg: 'linear-gradient(135deg, #e6fff8, #ccfff0, #b3ffe8)' },
        { id: 'coffee',    name: 'Cà Phê',           emoji: '☕', desc: 'Ấm áp như tách cà phê buổi sáng mùa đông',   price: 300,  previewBg: 'linear-gradient(-45deg, #1c110a, #2d1c0f, #3d2510, #4a2e14)' },
        { id: 'retro',     name: 'Retro Game',       emoji: '👾', desc: 'Hoài niệm trò chơi 8-bit xanh vàng cổ điển', price: 600,  previewBg: 'linear-gradient(-45deg, #1a1a0a, #292910, #1a2a10, #102015)' },
    ];

    // ===== STATE =====
    const state = {
        quizzes: [],
        currentQuiz: null,
        currentQuestionIndex: 0,
        mode: 'practice',
        answers: {},
        results: {},
        examSubmitted: false,
        theme: localStorage.getItem('quiz-theme') || 'light',
        user: {
            xp: parseInt(localStorage.getItem('quiz-xp') || '0'),
            unlockedThemes: JSON.parse(localStorage.getItem('quiz-unlocked-themes') || '["light", "dark"]'),
            wrongQuestions: JSON.parse(localStorage.getItem('quiz-wrong-qs') || '[]')
        },
        sessionXp: 0 // XP earned in current quiz
    };

    // ===== DOM HELPERS =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', async () => {
        injectSVGGradient();
        generateStars();
        applyTheme(state.theme);
        updateParticleEmojis();
        updateUserStats();
        bindEvents();
        await loadQuizzes();
        renderQuizGrid();
        updateWrongBanner();
    });

    function generateStars() {
        const field = document.getElementById('star-field');
        if (!field) return;
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1;
            star.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 4}s;
                animation-duration: ${2 + Math.random() * 3}s;
                opacity: ${Math.random() * 0.6 + 0.2};
            `;
            field.appendChild(star);
        }
    }

    const THEME_EMOJIS = {
        light:     ['⭐','📚','💛','✨','🌼','☀️','👑','🎯','🌟','💫','🎓','🔔'],
        dark:      ['🌙','⭐','💜','✨','🌌','⚡','👑','🎯','🌟','💫','🎓','🔮'],
        pastel:    ['🌈','🦋','💜','✨','🌸','🍬','👑','🎀','🌟','💫','🎓','🌺'],
        sakura:    ['🌸','💗','🌺','✨','🦋','🍵','👒','🌷','🌟','💕','🎎','🌹'],
        cyberpunk: ['⚡','🤖','💛','✨','🎮','🕹️','👾','🎯','⚙️','💡','🔧','🌐'],
        candy:     ['🍭','🍬','💖','🎀','🍩','🧁','🌈','🦄','✨','💫','🍰','🎊'],
        ocean:     ['🌊','🐠','💙','🐚','🦈','🐋','🌀','⚓','💎','🐬','🦑','🌐'],
        forest:    ['🌲','🍃','💚','🦌','🌿','🍄','🌱','🦊','🐦','🌳','🍀','🌾'],
        sunset:    ['🌅','🔥','🧡','🌄','🦁','🌻','⛅','🏜️','✨','🌇','💫','🌠'],
        galaxy:    ['🌌','⭐','💜','🚀','🛸','🔭','🌠','💫','🪐','🌟','✨','🌙'],
        mint:      ['🌿','🍀','💚','❄️','🌱','🦋','🌬️','☃️','✨','🐸','🍃','💎'],
        coffee:    ['☕','🍫','🤎','🧇','🍪','🥐','📖','🕯️','🌰','🫖','🧸','🪵'],
        retro:     ['👾','🕹️','💛','🎮','👻','🍒','⭐','🏆','🎯','💣','🔑','🃏'],
    };

    function updateParticleEmojis() {
        const theme = state.theme;
        const emojis = THEME_EMOJIS[theme] || THEME_EMOJIS.light;
        const particles = document.querySelectorAll('.particle');
        particles.forEach((p, i) => {
            p.setAttribute('data-char', emojis[i % emojis.length]);
        });
    }

    function injectSVGGradient() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.innerHTML = `
            <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#8b5cf6"/>
                    <stop offset="50%" style="stop-color:#ec4899"/>
                    <stop offset="100%" style="stop-color:#3b82f6"/>
                </linearGradient>
            </defs>
        `;
        document.body.prepend(svg);
    }

    // ===== USER STATS & WRONG QS =====
    function updateUserStats() {
        $('#xp-count').textContent = state.user.xp;
        if ($('#shop-xp-balance')) {
            $('#shop-xp-balance').textContent = state.user.xp;
        }
        const level = Math.floor(state.user.xp / 100) + 1;
        $('#user-level').textContent = level;
    }

    function addXp(amount) {
        state.user.xp += amount;
        state.sessionXp += amount;
        localStorage.setItem('quiz-xp', state.user.xp.toString());
        updateUserStats();
    }

    function addWrongQuestion(q) {
        const exists = state.user.wrongQuestions.some(item => item.id === q.id);
        if (!exists) {
            state.user.wrongQuestions.push(q);
            localStorage.setItem('quiz-wrong-qs', JSON.stringify(state.user.wrongQuestions));
        }
    }

    function removeWrongQuestion(qId) {
        state.user.wrongQuestions = state.user.wrongQuestions.filter(q => q.id !== qId);
        localStorage.setItem('quiz-wrong-qs', JSON.stringify(state.user.wrongQuestions));
    }

    function updateWrongBanner() {
        const banner = $('#review-banner-container');
        if (state.user.wrongQuestions.length > 0) {
            banner.style.display = 'block';
            $('#wrong-count').textContent = state.user.wrongQuestions.length;
        } else {
            banner.style.display = 'none';
        }
    }

    function startReviewWrongQs() {
        if (state.user.wrongQuestions.length === 0) return;
        
        const reviewQuiz = {
            id: 'review_wrong',
            name: 'Góc Ôn Tập',
            totalQuestions: state.user.wrongQuestions.length,
            questions: JSON.parse(JSON.stringify(state.user.wrongQuestions)) // clone
        };

        state.currentQuiz = reviewQuiz;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.results = {};
        state.examSubmitted = false;
        state.sessionXp = 0;

        // Force practice mode for reviewing
        setMode('practice');
        $('#btn-submit').style.display = 'none';
        $('#quiz-name').textContent = reviewQuiz.name;

        // Shuffle questions for review
        shuffleQuestionsInternal();

        renderQuestionMap();
        renderQuestion();
        updateProgress();
        updateScore();
        showScreen('quiz');
    }

    // ===== DATA LOADING =====
    async function loadQuizzes() {
        try {
            const resp = await fetch('quizzes.json');
            if (!resp.ok) throw new Error('Failed to load');
            const data = await resp.json();
            state.quizzes = data.quizzes;
        } catch (err) {
            console.error('Error loading quizzes:', err);
            $('#quiz-grid').innerHTML = `
                <div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--danger);">
                    <p>Không thể tải dữ liệu. Kiểm tra file <code>quizzes.json</code>.</p>
                </div>`;
        }
    }

    // ===== EVENT BINDING =====
    function bindEvents() {
        $('#btn-mode-practice').addEventListener('click', () => setMode('practice'));
        $('#btn-mode-exam').addEventListener('click', () => setMode('exam'));
        $('#btn-prev').addEventListener('click', () => navigate(-1));
        $('#btn-next').addEventListener('click', () => navigate(1));
        $('#btn-back-home').addEventListener('click', goHome);
        $('#logo-home').addEventListener('click', goHome);
        $('#btn-shuffle').addEventListener('click', shuffleQuestions);
        $('#btn-submit').addEventListener('click', submitExam);
        $('#btn-theme-cycle').addEventListener('click', cycleTheme);
        $('#btn-shop').addEventListener('click', openShop);
        $('#btn-shop-back').addEventListener('click', () => {
            if (state.currentQuiz) {
                showScreen('quiz');
            } else {
                showScreen('home');
            }
        });
        $('#btn-toggle-sidebar').addEventListener('click', () => $('#quiz-sidebar').classList.toggle('open'));
        $('#btn-retry').addEventListener('click', retryQuiz);
        $('#btn-home').addEventListener('click', goHome);
        $('#btn-start-review').addEventListener('click', startReviewWrongQs);
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!$('#screen-quiz').classList.contains('active')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
        else if ('abcdABCD'.includes(e.key)) selectAnswer(e.key.toLowerCase());
    }

    // ===== THEME & SHOP =====
    function applyTheme(themeId) {
        document.documentElement.setAttribute('data-theme', themeId);
        state.theme = themeId;
        localStorage.setItem('quiz-theme', themeId);
        updateParticleEmojis();
    }

    function cycleTheme() {
        const unlocked = state.user.unlockedThemes;
        if (unlocked.length <= 1) return;
        const currentIndex = unlocked.indexOf(state.theme);
        const nextIndex = (currentIndex + 1) % unlocked.length;
        const nextTheme = unlocked[nextIndex];
        
        applyTheme(nextTheme);
        
        // Quick visual feedback
        const btn = $('#btn-theme-cycle');
        btn.style.transform = 'rotate(180deg) scale(1.2)';
        setTimeout(() => btn.style.transform = '', 300);
    }

    function openShop() {
        showScreen('shop');
        renderShop();
    }

    function renderShop() {
        updateUserStats();
        $('#shop-grid').innerHTML = THEME_SHOP.map((theme, i) => {
            const isUnlocked = state.user.unlockedThemes.includes(theme.id);
            const isEquipped = state.theme === theme.id;

            let btnHtml = '';
            if (isEquipped) {
                btnHtml = `<button class="btn btn--ghost" disabled style="opacity:0.7">✓ Đang dùng</button>`;
            } else if (isUnlocked) {
                btnHtml = `<button class="btn btn--primary" onclick="window.equipTheme('${theme.id}')">Trang bị ngay</button>`;
            } else {
                btnHtml = `<button class="btn btn--primary" onclick="window.buyTheme('${theme.id}')">🛒 Mua ${theme.price} ⚡</button>`;
            }

            return `
                <div class="shop-item ${isEquipped ? 'equipped' : ''}" style="animation-delay: ${i * 0.07}s">
                    <div class="shop-item__preview" style="background: ${theme.previewBg};">${theme.emoji}</div>
                    <div class="shop-item__info">
                        <div class="shop-item__name">${theme.emoji} ${theme.name}</div>
                        <div class="shop-item__desc">${theme.desc}</div>
                        <div class="shop-item__price ${isUnlocked ? 'shop-item__price--owned' : ''}">
                            ${isUnlocked ? '✓ Đã mở khóa' : `${theme.price} ⚡ XP`}
                        </div>
                        ${btnHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    window.buyTheme = function(themeId) {
        const theme = THEME_SHOP.find(t => t.id === themeId);
        if (!theme) return;

        if (state.user.xp < theme.price) {
            showToast(`⚡ Thiếu ${theme.price - state.user.xp} XP để mua ${theme.name}!`, 'error');
            return;
        }

        state.user.xp -= theme.price;
        state.user.unlockedThemes.push(themeId);

        localStorage.setItem('quiz-xp', state.user.xp.toString());
        localStorage.setItem('quiz-unlocked-themes', JSON.stringify(state.user.unlockedThemes));

        applyTheme(themeId);
        renderShop();
        fireConfetti(2);
        showToast(`${theme.emoji} Đã mở khóa ${theme.name}!`);
    };

    window.equipTheme = function(themeId) {
        const theme = THEME_SHOP.find(t => t.id === themeId);
        applyTheme(themeId);
        renderShop();
        if (theme) showToast(`${theme.emoji} Đã chuyển sang ${theme.name}!`);
    };

    // ===== TOAST NOTIFICATION =====
    function showToast(msg, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.background = type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)';
        toast.style.color = 'white';
        toast.style.border = 'none';
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
    }


    // ===== MODE =====
    function setMode(mode) {
        state.mode = mode;
        $('#btn-mode-practice').classList.toggle('mode-btn--active', mode === 'practice');
        $('#btn-mode-exam').classList.toggle('mode-btn--active', mode === 'exam');
    }

    // ===== SCREENS =====
    function showScreen(name) {
        $$('.screen').forEach(s => s.classList.remove('active'));
        $(`#screen-${name}`).classList.add('active');
        $('#btn-toggle-sidebar').style.display = name === 'quiz' ? 'flex' : 'none';
        window.scrollTo(0, 0);
    }

    function goHome() {
        showScreen('home');
        state.currentQuiz = null;
        state.answers = {};
        state.results = {};
        state.examSubmitted = false;
        state.sessionXp = 0;
        updateWrongBanner();
    }

    // ===== QUIZ GRID =====
    function renderQuizGrid() {
        const icons = ['📚', '📖', '📝', '📋', '🎯', '🏆'];
        $('#quiz-grid').innerHTML = state.quizzes.map((q, i) => `
            <div class="quiz-card" data-id="${q.id}">
                <div class="quiz-card__icon">${icons[i % icons.length]}</div>
                <div class="quiz-card__name">${q.name}</div>
                <div class="quiz-card__meta">
                    <span>Pháp luật đại cương</span>
                </div>
                <div class="quiz-card__count">
                    <span>${q.totalQuestions} câu hỏi</span>
                </div>
            </div>`).join('');

        $$('.quiz-card').forEach(card => {
            card.addEventListener('click', () => startQuiz(card.dataset.id));
        });
    }

    // ===== START QUIZ =====
    function startQuiz(quizId) {
        const quiz = state.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        state.currentQuiz = JSON.parse(JSON.stringify(quiz));
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.results = {};
        state.examSubmitted = false;
        state.sessionXp = 0;

        $('#btn-submit').style.display = state.mode === 'exam' ? 'flex' : 'none';
        $('#quiz-name').textContent = quiz.name;
        
        renderQuestionMap();
        renderQuestion();
        updateProgress();
        updateScore();
        showScreen('quiz');
    }

    // ===== QUESTION MAP =====
    function renderQuestionMap() {
        const quiz = state.currentQuiz;
        $('#question-map').innerHTML = quiz.questions.map((_, i) =>
            `<button class="qmap-btn" data-idx="${i}">${i + 1}</button>`
        ).join('');

        $$('.qmap-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                goToQuestion(parseInt(btn.dataset.idx));
                $('#quiz-sidebar').classList.remove('open');
            });
        });
        updateQuestionMap();
    }

    function updateQuestionMap() {
        const quiz = state.currentQuiz;
        quiz.questions.forEach((q, i) => {
            const btn = $(`.qmap-btn[data-idx="${i}"]`);
            if (!btn) return;
            btn.className = 'qmap-btn';
            if (i === state.currentQuestionIndex) btn.classList.add('qmap-btn--active');
            else if (state.results[q.id] === 'correct') btn.classList.add('qmap-btn--correct');
            else if (state.results[q.id] === 'incorrect') btn.classList.add('qmap-btn--incorrect');
            else if (state.answers[q.id]) btn.classList.add('qmap-btn--answered');
        });
    }

    // ===== RENDER QUESTION =====
    function renderQuestion() {
        const quiz = state.currentQuiz;
        const idx = state.currentQuestionIndex;
        const q = quiz.questions[idx];
        const total = quiz.questions.length;
        const selectedKey = state.answers[q.id];
        const isChecked = state.results[q.id] !== undefined;

        $('#question-card').classList.remove('shake');
        $('#question-number').textContent = `Câu ${idx + 1} / ${total}`;
        $('#quiz-progress').textContent = `${idx + 1} / ${total}`;
        $('#question-text').textContent = q.question;

        const badge = $('#question-badge');
        badge.className = 'question-card__badge';
        if (isChecked && state.results[q.id] === 'correct') {
            badge.className += ' question-card__badge--correct';
            badge.textContent = '✓ Đúng';
            badge.style.display = 'inline-block';
        } else if (isChecked && state.results[q.id] === 'incorrect') {
            badge.className += ' question-card__badge--incorrect';
            badge.textContent = '✗ Sai';
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }

        const optionsHtml = q.options.map(opt => {
            const cls = buildOptionClasses(opt, q, selectedKey, isChecked);
            return `<div class="${cls}" data-key="${opt.key}">
                <span class="option__key">${opt.key}</span>
                <span class="option__text">${opt.text}</span>
            </div>`;
        }).join('');
        $('#question-options').innerHTML = optionsHtml;

        const canAnswer = !isChecked || (state.mode === 'exam' && !state.examSubmitted);
        if (canAnswer) {
            $$('#question-options .option').forEach(el => {
                el.addEventListener('click', () => selectAnswer(el.dataset.key));
            });
        }

        if (isChecked) {
            showFeedback(q, selectedKey);
        } else {
            $('#question-feedback').style.display = 'none';
            $('#feedback-xp').style.display = 'none';
        }

        $('#btn-prev').disabled = idx === 0;
        $('#btn-next').disabled = idx === total - 1;

        updateQuestionMap();
    }

    function buildOptionClasses(opt, q, selectedKey, isChecked) {
        let cls = ['option'];
        if (selectedKey === opt.key) cls.push('option--selected');

        if (isChecked) {
            cls.push('option--disabled');
            if (q.correctAnswers.includes(opt.key)) cls.push('option--correct');
            if (selectedKey === opt.key && !q.correctAnswers.includes(opt.key)) cls.push('option--incorrect');
            if (q.correctAnswers.includes(opt.key) && selectedKey !== opt.key) cls.push('option--correct-highlight');
        }
        return cls.join(' ');
    }

    // ===== SELECT ANSWER =====
    function selectAnswer(key) {
        const q = state.currentQuiz.questions[state.currentQuestionIndex];
        if (state.results[q.id] !== undefined && state.mode === 'practice') return;
        if (state.examSubmitted) return;

        state.answers[q.id] = key;

        if (state.mode === 'practice') {
            const isCorrect = q.correctAnswers.includes(key);
            state.results[q.id] = isCorrect ? 'correct' : 'incorrect';
            
            if (isCorrect) {
                addXp(10);
                if (state.currentQuiz.id === 'review_wrong') {
                    removeWrongQuestion(q.id);
                }
            } else {
                addWrongQuestion(q);
                $('#question-card').classList.remove('shake');
                void $('#question-card').offsetWidth;
                $('#question-card').classList.add('shake');
            }
            updateScore();
        }

        renderQuestion();
        updateProgress();

        if (state.mode === 'practice') {
            const total = state.currentQuiz.questions.length;
            const answered = Object.keys(state.results).length;

            if (answered >= total) {
                setTimeout(() => showResults(), 2000);
            }
        }
    }

    // ===== FEEDBACK =====
    function showFeedback(q, selectedKey) {
        const fb = $('#question-feedback');
        fb.style.display = 'flex';
        
        const isCorrect = q.correctAnswers.includes(selectedKey);
        
        if (!selectedKey) {
            fb.className = 'question-card__feedback question-card__feedback--incorrect';
            $('#feedback-icon').textContent = '⚠️';
            $('#feedback-title').textContent = 'Chưa trả lời';
            const ans = q.correctAnswers.map(k => {
                const o = q.options.find(x => x.key === k);
                return o ? `${k.toUpperCase()}. ${o.text}` : k;
            });
            $('#feedback-text').textContent = `Đáp án đúng: ${ans.join(', ')}`;
            $('#feedback-explanation').innerHTML = '';
            return;
        }

        let explanationHtml = "";
        if (q.explanation) {
            explanationHtml = q.explanation;
        } else {
            const qText = q.question.toLowerCase();
            const isNegativeQuestion = qText.includes('sai') || qText.includes('không đúng') || qText.includes('chưa đúng');
            
            const explanationLines = q.options.map(opt => {
                const key = opt.key.toUpperCase();
                const isAnswer = q.correctAnswers.includes(opt.key);
                
                if (isNegativeQuestion) {
                    if (isAnswer) {
                        return `<strong>Ý ${key} sai:</strong> Nội dung "${opt.text}" là không chính xác hoặc không phù hợp.`;
                    } else {
                        return `<strong>Ý ${key} đúng:</strong> Nội dung "${opt.text}" là đúng theo quy định.`;
                    }
                } else {
                    if (isAnswer) {
                        return `<strong>Ý ${key} đúng:</strong> Nội dung "${opt.text}" là chính xác.`;
                    } else {
                        return `<strong>Ý ${key} sai:</strong> Nội dung "${opt.text}" là sai hoặc chưa đầy đủ.`;
                    }
                }
            });
            
            const correctKeys = q.correctAnswers.map(k => k.toUpperCase()).join(', ');
            explanationLines.push(`<br><strong>Chốt lại:</strong> Đáp án cần chọn là ý <strong>${correctKeys}</strong>.`);
            explanationHtml = explanationLines.join('<br>');
        }

        if (isCorrect) {
            fb.className = 'question-card__feedback question-card__feedback--correct';
            $('#feedback-icon').textContent = '🎉';
            $('#feedback-title').textContent = 'Tuyệt vời!';
            $('#feedback-text').textContent = 'Bạn đã chọn đúng đáp án.';
            $('#feedback-explanation').innerHTML = explanationHtml;
            $('#feedback-xp').style.display = 'block';
        } else {
            fb.className = 'question-card__feedback question-card__feedback--incorrect';
            $('#feedback-icon').textContent = '❌';
            $('#feedback-title').textContent = 'Sai rồi!';
            const ans = q.correctAnswers.map(k => {
                const o = q.options.find(x => x.key === k);
                return o ? `${k.toUpperCase()}. ${o.text}` : k;
            });
            $('#feedback-text').textContent = `Đáp án đúng: ${ans.join(', ')}`;
            $('#feedback-explanation').innerHTML = explanationHtml;
            $('#feedback-xp').style.display = 'none';
        }
    }

    // ===== NAVIGATION =====
    function goToQuestion(idx) {
        const total = state.currentQuiz.questions.length;
        if (idx < 0 || idx >= total) return;
        state.currentQuestionIndex = idx;
        renderQuestion();
        updateProgress();
        const content = $('#question-options').closest('.quiz-content');
        if (content) content.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigate(dir) {
        goToQuestion(state.currentQuestionIndex + dir);
    }

    // ===== PROGRESS & SCORE =====
    function updateProgress() {
        const total = state.currentQuiz.questions.length;
        const answered = Object.keys(state.answers).length;
        $('#progress-bar-fill').style.width = `${(answered / total) * 100}%`;
    }

    function updateScore() {
        if (!state.currentQuiz) return;
        const total = state.currentQuiz.questions.length;
        const correct = Object.values(state.results).filter(r => r === 'correct').length;
        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

        $('#score-ring-text').textContent = `${pct}%`;
        const circumference = 2 * Math.PI * 42;
        $('#score-ring-fill').style.strokeDashoffset = circumference - (pct / 100) * circumference;
    }

    // ===== SHUFFLE =====
    function shuffleQuestionsInternal() {
        if (!state.currentQuiz) return;
        const q = state.currentQuiz.questions;
        for (let i = q.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [q[i], q[j]] = [q[j], q[i]];
        }
    }

    function shuffleQuestions() {
        shuffleQuestionsInternal();
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.results = {};
        state.examSubmitted = false;
        renderQuestionMap();
        renderQuestion();
        updateProgress();
        updateScore();
    }

    // ===== EXAM SUBMIT =====
    function submitExam() {
        if (state.mode !== 'exam') return;
        const total = state.currentQuiz.questions.length;
        const answered = Object.keys(state.answers).length;

        if (answered < total) {
            if (!confirm(`Còn ${total - answered} câu chưa trả lời. Nộp bài?`)) return;
        }

        let newXp = 0;
        state.currentQuiz.questions.forEach(q => {
            const sel = state.answers[q.id];
            const isCorrect = sel && q.correctAnswers.includes(sel);
            state.results[q.id] = isCorrect ? 'correct' : 'incorrect';
            
            if (isCorrect) {
                newXp += 10;
                if (state.currentQuiz.id === 'review_wrong') {
                    removeWrongQuestion(q.id);
                }
            } else {
                addWrongQuestion(q);
            }
        });
        
        if (newXp > 0) {
            addXp(newXp);
        }
        
        state.examSubmitted = true;
        showResults();
    }

    // ===== RESULTS =====
    function showResults() {
        const quiz = state.currentQuiz;
        const total = quiz.questions.length;
        const correct = Object.values(state.results).filter(r => r === 'correct').length;
        const pct = Math.round((correct / total) * 100);

        const icon = $('#result-icon');
        if (pct >= 80) {
            icon.textContent = '🏆';
            $('#result-title').textContent = 'Xuất sắc!';
            $('#result-subtitle').textContent = `Hoàn thành ${quiz.name} với kết quả tuyệt vời!`;
            fireConfetti(3);
        } else if (pct >= 50) {
            icon.textContent = '👍';
            $('#result-title').textContent = 'Khá tốt!';
            $('#result-subtitle').textContent = `Hoàn thành ${quiz.name}. Cần cố gắng thêm!`;
        } else {
            icon.textContent = '📖';
            $('#result-title').textContent = 'Cần ôn thêm!';
            $('#result-subtitle').textContent = `Hãy luyện tập thêm ${quiz.name} nhé!`;
        }

        $('#result-xp-earned').textContent = `+${state.sessionXp} XP`;
        
        // Counter animation
        animateValue($('#result-score-value'), 0, correct, 1500);
        $('#result-score-total').textContent = `/${total}`;

        const circumference = 2 * Math.PI * 52;
        const ringFill = $('#result-ring-fill');
        ringFill.style.strokeDasharray = circumference;
        ringFill.style.strokeDashoffset = circumference;
        setTimeout(() => {
            ringFill.style.strokeDashoffset = circumference - (pct / 100) * circumference;
        }, 300);

        const wrongQs = quiz.questions.filter(q => state.results[q.id] === 'incorrect');
        if (wrongQs.length === 0) {
            $('#result-review').style.display = 'none';
        } else {
            $('#result-review').style.display = '';
            $('#result-review-list').innerHTML = wrongQs.map(q => {
                const yourKey = state.answers[q.id];
                const yourOpt = yourKey ? q.options.find(o => o.key === yourKey) : null;
                const correctTexts = q.correctAnswers.map(k => {
                    const o = q.options.find(x => x.key === k);
                    return o ? `${k.toUpperCase()}. ${o.text}` : k;
                });
                return `<div class="review-item">
                    <p class="review-item__question"><span class="review-item__number">Câu ${quiz.questions.indexOf(q) + 1}:</span> ${q.question}</p>
                    <p class="review-item__your-answer">✗ Bạn chọn: ${yourOpt ? `${yourKey.toUpperCase()}. ${yourOpt.text}` : 'Chưa trả lời'}</p>
                    <p class="review-item__correct-answer">✓ Đáp án đúng: ${correctTexts.join(', ')}</p>
                </div>`;
            }).join('');
        }

        showScreen('result');
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function fireConfetti(durationMultiplier = 3) {
        if (typeof confetti === 'function') {
            const duration = durationMultiplier * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }

    // ===== RETRY =====
    function retryQuiz() {
        if (!state.currentQuiz) return goHome();
        if (state.currentQuiz.id === 'review_wrong') {
            startReviewWrongQs();
        } else {
            startQuiz(state.currentQuiz.id);
        }
    }

})();
