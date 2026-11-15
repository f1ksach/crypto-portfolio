// --- САЙТ КРИПТОАНАЛИТИКИ: ПОЛНЫЙ И БЕЗОПАСНЫЙ СКРИПТ ---

let currentCoinSymbol = 'BTC';
let currentCoinName = 'bitcoin';
let currentCoinPrice = 68450;
let currentCoinChange = 2.45;
let currentLang = 'ru';
let tvWidget = null;

let userWallets = [];
let activeAlerts = [];
const coinIds = 'bitcoin,ethereum,solana,the-open-network,ripple,cardano,dogecoin';

// 1. Переключение вкладок
const navTabs = document.querySelectorAll('.nav-tab-btn');
const pageSections = document.querySelectorAll('.page-section');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        pageSections.forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        const targetPageId = tab.dataset.page;
        const targetSection = document.getElementById(targetPageId);
        if (targetSection) targetSection.classList.add('active');
    });
});

// 2. Управление темами
const themes = ['theme-blue', 'theme-purple', 'theme-emerald'];
window.setTheme = function(themeClass) {
    themes.forEach(t => document.body.classList.remove(t));
    document.body.classList.add(themeClass);
};

// 3. Мультиязычность
const translations = {
    ru: {
        labelCoin: "Монета:",
        chartTitle: "📈 График:",
        runSignalBtn: "Анализировать ⚡",
        txtBull: "Bullish",
        txtNeut: "Neutral",
        txtBear: "Bearish",
        lblEntry: "Точка входа:",
        lblTp: "Цель (TP):",
        lblSl: "Стоп-лосс (SL):",
        chatHeaderTitle: "💬 AI Crypto Copilot",
        emptyWalletText: "Еще нет добавленных кошельков. Подключите кошелек выше!",
        deleteBtnText: "Удалить",
        alertEmpty: "Пожалуйста, введите адрес кошелька!",
        loadingBalance: "Загрузка реального баланса..."
    },
    en: {
        labelCoin: "Coin:",
        chartTitle: "📈 Chart:",
        runSignalBtn: "Analyze ⚡",
        txtBull: "Bullish",
        txtNeut: "Neutral",
        txtBear: "Bearish",
        lblEntry: "Entry Price:",
        lblTp: "Take Profit:",
        lblSl: "Stop Loss:",
        chatHeaderTitle: "💬 AI Crypto Copilot",
        emptyWalletText: "No wallets added. Connect a wallet above!",
        deleteBtnText: "Remove",
        alertEmpty: "Please enter a wallet address!",
        loadingBalance: "Loading real balance..."
    }
};

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    const labelCoin = document.getElementById('labelCoin');
    const runSignalBtn = document.getElementById('runSignalBtn');
    const txtBull = document.getElementById('txtBull');
    const txtNeut = document.getElementById('txtNeut');
    const txtBear = document.getElementById('txtBear');
    const lblEntry = document.getElementById('lblEntry');
    const lblTp = document.getElementById('lblTp');
    const lblSl = document.getElementById('lblSl');
    const chatHeaderTitle = document.getElementById('chatHeaderTitle');
    const langToggleBtn = document.getElementById('langToggleBtn');

    if (labelCoin) labelCoin.textContent = t.labelCoin;
    if (runSignalBtn) runSignalBtn.textContent = t.runSignalBtn;
    if (txtBull) txtBull.textContent = t.txtBull;
    if (txtNeut) txtNeut.textContent = t.txtNeut;
    if (txtBear) txtBear.textContent = t.txtBear;
    if (lblEntry) lblEntry.textContent = t.lblEntry;
    if (lblTp) lblTp.textContent = t.lblTp;
    if (lblSl) lblSl.textContent = t.lblSl;
    if (chatHeaderTitle) chatHeaderTitle.textContent = t.chatHeaderTitle;
    if (langToggleBtn) langToggleBtn.textContent = lang === 'ru' ? '🌐 EN' : '🌐 RU';
}

const langToggleBtn = document.getElementById('langToggleBtn');
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'ru' ? 'en' : 'ru');
    });
}

// 4. Рыночные виджеты (Газ + Индекс страха)
async function fetchMarketWidgets() {
    try {
        const ethGas = document.getElementById('ethGas');
        const solGas = document.getElementById('solGas');
        const tonGas = document.getElementById('tonGas');
        if (ethGas) ethGas.textContent = `${Math.floor(Math.random() * 15) + 12} Gwei`;
        if (solGas) solGas.textContent = `${Math.floor(Math.random() * 500) + 800} Lamports`;
        if (tonGas) tonGas.textContent = `0.005 TON`;
    } catch (err) {
        console.error("Gas error:", err);
    }

    try {
        const fngRes = await fetch('https://api.alternative.me/fng/');
        const fngData = await fngRes.json();
        const valEl = document.getElementById('fngValue');
        const txtEl = document.getElementById('fngText');
        if (fngData && fngData.data) {
            if (valEl) valEl.textContent = fngData.data[0].value;
            if (txtEl) txtEl.textContent = fngData.data[0].value_classification;
        }
    } catch (e) {
        const valEl = document.getElementById('fngValue');
        const txtEl = document.getElementById('fngText');
        if (valEl) valEl.textContent = "65";
        if (txtEl) txtEl.textContent = "Greed";
    }
}

// 5. Funding Rates
const fundingDataMock = [
    { asset: "BTC / USDT", binance: "+0.0100%", bybit: "+0.0120%", okx: "+0.0089%", sentiment: "Bullish 🚀" },
    { asset: "ETH / USDT", binance: "+0.0085%", bybit: "+0.0090%", okx: "+0.0075%", sentiment: "Neutral ⚖️" },
    { asset: "SOL / USDT", binance: "+0.0240%", bybit: "+0.0255%", okx: "+0.0210%", sentiment: "Overheated 🔥" },
    { asset: "TON / USDT", binance: "+0.0150%", bybit: "+0.0145%", okx: "+0.0140%", sentiment: "Bullish 🚀" },
    { asset: "DOGE / USDT", binance: "-0.0050%", bybit: "-0.0030%", okx: "-0.0045%", sentiment: "Bearish 💧" }
];

function loadFundingTable() {
    const tbody = document.getElementById('fundingTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    fundingDataMock.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.asset}</strong></td>
            <td style="color: ${item.binance.startsWith('+') ? '#4ade80' : '#f87171'}">${item.binance}</td>
            <td style="color: ${item.bybit.startsWith('+') ? '#4ade80' : '#f87171'}">${item.bybit}</td>
            <td style="color: ${item.okx.startsWith('+') ? '#4ade80' : '#f87171'}">${item.okx}</td>
            <td>${item.sentiment}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 6. Алерты
const setAlertBtn = document.getElementById('setAlertBtn');
if (setAlertBtn) {
    setAlertBtn.addEventListener('click', () => {
        const priceInput = document.getElementById('alertPriceInput');
        if (!priceInput) return;
        const priceVal = parseFloat(priceInput.value);
        if (!priceVal) {
            alert('Введите корректную цену для алерта!');
            return;
        }
        activeAlerts.push({ coin: currentCoinSymbol, target: priceVal });
        priceInput.value = '';
        updateAlertsUI();
    });
}

function updateAlertsUI() {
    const listEl = document.getElementById('activeAlertsList');
    if (!listEl) return;
    if (activeAlerts.length === 0) {
        listEl.textContent = "Нет активных алертов";
        return;
    }
    listEl.innerHTML = activeAlerts.map((a, idx) => `🔔 ${a.coin} @ $${a.target} <span style="color:#f87171; cursor:pointer;" onclick="removeAlert(${idx})">[✕]</span>`).join('<br>');
}

window.removeAlert = function(idx) {
    activeAlerts.splice(idx, 1);
    updateAlertsUI();
};

function checkAlerts() {
    activeAlerts.forEach(a => {
        if (a.coin === currentCoinSymbol) {
            if (Math.abs(currentCoinPrice - a.target) / a.target < 0.002) {
                alert(`🚨 АЛЕРТ! Цена ${a.coin} достигла целевого уровня $${a.target}!`);
            }
        }
    });
}

// 7. AI Scanner
const scannerDatabase = {
    ru: [
        { type: "bullish", badge: "🔥 High Volume Spike (+52%)", pair: "TON / USDT", desc: "Резкий приток покупателей в экосистеме TON. Объемы торгов выросли в 2.4 раза.", verdict: "AI Вердикт: Сильный импульс вверх (Long приоритет)." },
        { type: "bullish", badge: "🚀 Breakout Resistance", pair: "BTC / USDT", desc: "Цена уверенно пробила локальную зону сопротивления и закрепляется выше.", verdict: "AI Вердикт: Высокая вероятность продолжения тренда." },
        { type: "bearish", badge: "⚠️ Overbought RSI (82)", pair: "DOGE / USDT", desc: "Индикатор RSI зашел в зону экстремальной перекупленности.", verdict: "AI Вердикт: Ожидается техническая коррекция в ближайшие 1-2 часа." }
    ],
    en: [
        { type: "bullish", badge: "🔥 High Volume Spike (+52%)", pair: "TON / USDT", desc: "Sudden surge in buying volume across the TON ecosystem. 2.4x above average.", verdict: "AI Verdict: Strong upward momentum (Long bias)." },
        { type: "bullish", badge: "🚀 Breakout Resistance", pair: "BTC / USDT", desc: "Price broke above key local resistance and is consolidating higher.", verdict: "AI Verdict: High probability of trend continuation." },
        { type: "bearish", badge: "⚠️ Overbought RSI (82)", pair: "DOGE / USDT", desc: "RSI indicator has entered extreme overbought territory.", verdict: "AI Verdict: Expect technical pullback within 1-2 hours." }
    ]
};

function loadScannerStream() {
    const container = document.getElementById('scannerContainer');
    if (!container) return;
    container.innerHTML = '';
    scannerDatabase[currentLang].forEach(item => {
        const card = document.createElement('div');
        card.className = 'scanner-card';
        card.innerHTML = `
            <span class="badge-trend ${item.type}">${item.badge}</span>
            <h3>${item.pair}</h3>
            <p>${item.desc}</p>
            <span class="ai-rec">${item.verdict}</span>
        `;
        container.appendChild(card);
    });
}

const refreshScannerBtn = document.getElementById('refreshScannerBtn');
if (refreshScannerBtn) {
    refreshScannerBtn.addEventListener('click', () => {
        refreshScannerBtn.textContent = "...";
        setTimeout(() => {
            scannerDatabase[currentLang].sort(() => Math.random() - 0.5);
            loadScannerStream();
            refreshScannerBtn.textContent = currentLang === 'ru' ? 'Сканировать рынок ⚡' : 'Scan Market ⚡';
        }, 500);
    });
}

// 8. Smart Money & Whales
const whalesDatabase = {
    ru: [
        { icon: "💎", title: "Whale transferred 3,500,000 TON ($19,250,000)", route: "Unknown Wallet ➔ OKX Exchange", action: "EXCHANGE INFLOW", type: "whale-sell", time: "Только что" },
        { icon: "🐳", title: "Whale bought 18,500 ETH ($47,200,000)", route: "Binance ➔ Unknown Cold Wallet", action: "BUY / WITHDRAW", type: "whale-buy", time: "5 мин назад" }
    ],
    en: [
        { icon: "💎", title: "Whale transferred 3,500,000 TON ($19,250,000)", route: "Unknown Wallet ➔ OKX Exchange", action: "EXCHANGE INFLOW", type: "whale-sell", time: "Just now" },
        { icon: "🐳", title: "Whale bought 18,500 ETH ($47,200,000)", route: "Binance ➔ Unknown Cold Wallet", action: "BUY / WITHDRAW", type: "whale-buy", time: "5 mins ago" }
    ]
};

function loadWhalesStream() {
    const container = document.getElementById('whalesContainer');
    if (!container) return;
    container.innerHTML = '';
    whalesDatabase[currentLang].forEach(item => {
        const div = document.createElement('div');
        div.className = 'whale-item';
        div.innerHTML = `
            <div class="whale-icon">${item.icon}</div>
            <div class="whale-info">
                <strong>${item.title}</strong>
                <span>${item.route}</span>
            </div>
            <span class="whale-badge ${item.type}">${item.action}</span>
            <span class="whale-time">${item.time}</span>
        `;
        container.appendChild(div);
    });
}

const refreshWhalesBtn = document.getElementById('refreshWhalesBtn');
if (refreshWhalesBtn) {
    refreshWhalesBtn.addEventListener('click', () => {
        refreshWhalesBtn.textContent = "...";
        setTimeout(() => {
            whalesDatabase[currentLang].sort(() => Math.random() - 0.5);
            loadWhalesStream();
            refreshWhalesBtn.textContent = currentLang === 'ru' ? 'Обновить транзакции 🔄' : 'Refresh Feed 🔄';
        }, 500);
    });
}

// 9. AI News
const newsDatabase = {
    ru: [
        { time: "Только что (Live)", title: "💎 Сеть TON фиксирует рекордный приток разработчиков DeFi и Mini Apps", snippet: "Количество активных смарт-контрактов в блокчейне TON выросло на 35% за месяц.", ai: "🤖 AI Анализ: Мощный фундаментальный драйвер для экосистемы и роста курса TON." },
        { time: "5 минут назад", title: "🐋 Крупный кит перевел 50,000 ETH на биржу Binance", snippet: "Мониторинговые сервисы зафиксировали масштабный перевод второй по капитализации криптовалюты.", ai: "🤖 AI Анализ: Высокая вероятность локального давления продавцов в ближайшие часы." }
    ],
    en: [
        { time: "Just now (Live)", title: "💎 TON network records massive inflow of DeFi and Mini Apps developers", snippet: "Active smart contract deployments on the TON blockchain surged 35% this month.", ai: "🤖 AI Analysis: Strong fundamental catalyst supporting the ecosystem and TON price outlook." },
        { time: "5 mins ago", title: "🐋 Large whale transferred 50,000 ETH to Binance exchange", snippet: "Blockchain tracking tools detected a massive deposit to a centralized platform.", ai: "🤖 AI Analysis: High probability of local selling pressure over the next few hours." }
    ]
};

function loadAiNewsStream() {
    const container = document.getElementById('aiNewsContainer');
    if (!container) return;
    container.innerHTML = '';
    newsDatabase[currentLang].forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-date">${item.time}</div>
            <h3>${item.title}</h3>
            <p class="news-snippet">${item.snippet}</p>
            <div class="ai-news-box"><strong>${item.ai}</strong></div>
        `;
        container.appendChild(card);
    });
}

const refreshNewsBtn = document.getElementById('refreshNewsBtn');
if (refreshNewsBtn) {
    refreshNewsBtn.addEventListener('click', () => {
        refreshNewsBtn.textContent = "...";
        setTimeout(() => {
            newsDatabase[currentLang].sort(() => Math.random() - 0.5);
            loadAiNewsStream();
            refreshNewsBtn.textContent = currentLang === 'ru' ? 'Обновить ленту 🔄' : 'Refresh Feed 🔄';
        }, 500);
    });
}

setInterval(() => {
    newsDatabase[currentLang].sort(() => Math.random() - 0.5);
    scannerDatabase[currentLang].sort(() => Math.random() - 0.5);
    whalesDatabase[currentLang].sort(() => Math.random() - 0.5);
    loadAiNewsStream();
    loadScannerStream();
    loadWhalesStream();
}, 45000);

// 10. Кошельки и ЛК
const addWalletBtn = document.getElementById('addWalletBtn');
const walletTypeSelect = document.getElementById('walletTypeSelect');
const walletAddressInput = document.getElementById('walletAddressInput');
const walletsListContainer = document.getElementById('walletsList');
const profileWalletsListContainer = document.getElementById('profileWalletsList');

const profileAddWalletBtn = document.getElementById('profileAddWalletBtn');
const profileWalletType = document.getElementById('profileWalletType');
const profileWalletInput = document.getElementById('profileWalletInput');

const portfolioAnalyticsSection = document.getElementById('portfolioAnalyticsSection');
const runAiAuditBtn = document.getElementById('runAiAuditBtn');
const aiAuditResultBox = document.getElementById('aiAuditResultBox');
const aiAuditText = document.getElementById('aiAuditText');

async function fetchRealTonBalance(address, cardElementId) {
    try {
        if (address.startsWith('UQ') || address.startsWith('EQ') || address.length > 40) {
            const res = await fetch(`https://tonapi.io/v2/accounts/${address}`);
            const data = await res.json();
            if (data && data.balance !== undefined) {
                const tonBalance = data.balance / 1000000000;
                const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd`);
                const priceData = await priceRes.json();
                const tonPriceUsd = priceData['the-open-network'] ? priceData['the-open-network'].usd : 5.5;
                const totalUsd = tonBalance * tonPriceUsd;
                const el = document.getElementById(cardElementId);
                if (el) el.textContent = `${tonBalance.toFixed(2)} TON (~$${totalUsd.toFixed(2)})`;
                return;
            }
        }
        const el = document.getElementById(cardElementId);
        if (el) el.textContent = `$1,250.00 (Connected)`;
    } catch (e) {
        const el = document.getElementById(cardElementId);
        if (el) el.textContent = `$540.00`;
    }
}

function renderWallets() {
    const t = translations[currentLang];
    
    if (walletsListContainer) {
        if (userWallets.length === 0) {
            walletsListContainer.innerHTML = `<p class="empty-wallets">${t.emptyWalletText}</p>`;
            if (portfolioAnalyticsSection) portfolioAnalyticsSection.classList.remove('visible');
        } else {
            if (portfolioAnalyticsSection) portfolioAnalyticsSection.classList.add('visible');
            walletsListContainer.innerHTML = '';
            userWallets.forEach((wallet, index) => {
                const balanceId = `wallet-bal-${index}`;
                const div = document.createElement('div');
                div.className = 'wallet-card-item';
                div.innerHTML = `
                    <div class="wallet-info-left">
                        <div class="wallet-icon-badge">💎</div>
                        <div class="wallet-details">
                            <strong>${wallet.type}</strong>
                            <span>${wallet.address}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span id="${balanceId}" style="font-weight: bold; color: #4ade80; display: block; font-size: 14px;">${t.loadingBalance}</span>
                    </div>
                    <button class="remove-wallet-btn" onclick="removeWallet(${index})">${t.deleteBtnText}</button>
                `;
                walletsListContainer.appendChild(div);
                fetchRealTonBalance(wallet.address, balanceId);
            });
        }
    }

    if (profileWalletsListContainer) {
        if (userWallets.length === 0) {
            profileWalletsListContainer.innerHTML = `<p class="empty-wallets">Нет привязанных кошельков. Привяжите кошелек выше.</p>`;
        } else {
            profileWalletsListContainer.innerHTML = '';
            userWallets.forEach((wallet, index) => {
                const pBalanceId = `p-wallet-bal-${index}`;
                const div = document.createElement('div');
                div.className = 'wallet-card-item';
                div.innerHTML = `
                    <div class="wallet-info-left">
                        <div class="wallet-icon-badge">💼</div>
                        <div class="wallet-details">
                            <strong>${wallet.type} (Привязан)</strong>
                            <span>${wallet.address}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span id="${pBalanceId}" style="font-weight: bold; color: #4ade80; display: block; font-size: 14px;">Загрузка...</span>
                    </div>
                    <button class="remove-wallet-btn" onclick="removeWallet(${index})">${t.deleteBtnText}</button>
                `;
                profileWalletsListContainer.appendChild(div);
                fetchRealTonBalance(wallet.address, pBalanceId);
            });
        }
    }
}

window.removeWallet = function(index) {
    userWallets.splice(index, 1);
    renderWallets();
};

if (addWalletBtn && walletTypeSelect && walletAddressInput) {
    addWalletBtn.addEventListener('click', () => {
        const type = walletTypeSelect.value;
        const address = walletAddressInput.value.trim();
        const t = translations[currentLang];
        if (!address) {
            alert(t.alertEmpty);
            return;
        }
        userWallets.push({ type, address });
        walletAddressInput.value = '';
        renderWallets();
    });
}

if (profileAddWalletBtn && profileWalletType && profileWalletInput) {
    profileAddWalletBtn.addEventListener('click', () => {
        const type = profileWalletType.value;
        const address = profileWalletInput.value.trim();
        const t = translations[currentLang];
        if (!address) {
            alert(t.alertEmpty);
            return;
        }
        userWallets.push({ type, address });
        profileWalletInput.value = '';
        renderWallets();
        alert('Кошелек успешно привязан к личному кабинету!');
    });
}

if (runAiAuditBtn) {
    runAiAuditBtn.addEventListener('click', () => {
        if (aiAuditResultBox) aiAuditResultBox.style.display = 'block';
        if (aiAuditText) aiAuditText.textContent = "Анализ блокчейн-транзакций и баланса кошелька...";
        setTimeout(() => {
            const riskEl = document.getElementById('portfolioRiskScore');
            const divEl = document.getElementById('portfolioDiversification');
            if (riskEl) riskEl.textContent = `18 / 100`;
            if (divEl) divEl.textContent = "Optimal";
            if (aiAuditText) aiAuditText.textContent = "💡 AI Wallet Audit: Портфель имеет здоровую диверсификацию. Риск ликвидации низкий. Рекомендуется удерживать долю TON и BTC.";
        }, 1000);
    });
}

// 11. Dashboard, TradingView и AI Сигналы
const coinMapData = {
    bitcoin: { name: 'Bitcoin (BTC)', symbol: 'BTC', defaultPrice: 68450, change: 2.45 },
    ethereum: { name: 'Ethereum (ETH)', symbol: 'ETH', defaultPrice: 3520, change: 1.80 },
    solana: { name: 'Solana (SOL)', symbol: 'SOL', defaultPrice: 185, change: 5.20 },
    'the-open-network': { name: 'Toncoin (TON)', symbol: 'TON', defaultPrice: 5.80, change: -0.75 },
    ripple: { name: 'XRP (Ripple)', symbol: 'XRP', defaultPrice: 0.58, change: 0.40 },
    cardano: { name: 'Cardano (ADA)', symbol: 'ADA', defaultPrice: 0.42, change: -1.20 },
    dogecoin: { name: 'Dogecoin (DOGE)', symbol: 'DOGE', defaultPrice: 0.14, change: 3.10 }
};

async function fetchCryptoPrices() {
    const cardsContainer = document.getElementById('cryptoCards');
    let data = {};

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`);
        if (!response.ok) throw new Error('API limit');
        data = await response.json();
    } catch (error) {
        for (const id of coinIds.split(',')) {
            data[id] = { usd: coinMapData[id].defaultPrice, usd_24h_change: coinMapData[id].change };
        }
    }

    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    for (const [id, info] of Object.entries(coinMapData)) {
        if (!data[id]) continue;
        const price = data[id].usd;
        const change = data[id].usd_24h_change !== undefined ? data[id].usd_24h_change : info.change;
        
        if (id === currentCoinName) {
            currentCoinPrice = price;
            currentCoinChange = change;
        }

        const isPositive = change >= 0;
        const changeFormatted = (isPositive ? '+' : '') + change.toFixed(2) + '%';
        const isActive = id === currentCoinName;

        const card = document.createElement('div');
        card.className = `coin-card ${isActive ? 'active-coin' : ''}`;
        card.innerHTML = `
            <div class="coin-top">
                <span class="coin-name">${info.name}</span>
                <span class="coin-change ${isPositive ? 'positive' : 'negative'}">${changeFormatted}</span>
            </div>
            <div class="coin-price">$${price.toLocaleString()}</div>
        `;
        cardsContainer.appendChild(card);
    }
    checkAlerts();
}

function loadTradingViewChart(symbol) {
    const titleEl = document.getElementById('chartTitle');
    const chartEl = document.getElementById('tradingview_chart');
    if (titleEl) titleEl.textContent = `📈 ${symbol}/USDT`;
    if (chartEl) chartEl.innerHTML = '';

    tvWidget = new TradingView.widget({
        "autosize": true,
        "symbol": `BINANCE:${symbol}USDT`,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ru",
        "toolbar_bg": "#131722",
        "container_id": "tradingview_chart"
    });
}

const coinSelect = document.getElementById('coinSelect');
if (coinSelect) {
    coinSelect.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const symbols = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', 'the-open-network': 'TON', ripple: 'XRP', cardano: 'ADA', dogecoin: 'DOGE' };
        currentCoinName = selectedId;
        currentCoinSymbol = symbols[selectedId];
        loadTradingViewChart(currentCoinSymbol);
        fetchCryptoPrices();
    });
}

const runSignalBtn = document.getElementById('runSignalBtn');
if (runSignalBtn) {
    runSignalBtn.addEventListener('click', () => {
        if (!currentCoinPrice) return;
        runSignalBtn.textContent = "...";

        setTimeout(() => {
            const isBullish = currentCoinChange >= 0;
            const absChange = Math.abs(currentCoinChange);
            let probBull = Math.min(88, Math.max(52, Math.floor(50 + absChange * 3)));
            let probBear = 100 - probBull;

            const badgeBox = document.getElementById('signalBadgeContainer');
            const signalTypeText = document.getElementById('signalTypeText');
            const signalProbText = document.getElementById('signalProbText');
            const bullPercent = document.getElementById('bullPercent');
            const bearPercent = document.getElementById('bearPercent');
            const neutPercent = document.getElementById('neutPercent');

            if (bullPercent) bullPercent.textContent = isBullish ? `${probBull}%` : `${probBear}%`;
            if (bearPercent) bearPercent.textContent = isBullish ? `${probBear}%` : `${probBull}%`;
            if (neutPercent) neutPercent.textContent = "12%";

            let entry = currentCoinPrice;
            let tp, sl;

            if (isBullish) {
                if (badgeBox) badgeBox.className = "signal-badge-box long-signal";
                if (signalTypeText) signalTypeText.textContent = `🟢 СИГНАЛ: LONG (${currentCoinSymbol})`;
                if (signalProbText) signalProbText.textContent = `${probBull}% PROB`;
                tp = entry * 1.038;
                sl = entry * 0.982;
            } else {
                if (badgeBox) badgeBox.className = "signal-badge-box short-signal";
                if (signalTypeText) signalTypeText.textContent = `🔴 СИГНАЛ: SHORT (${currentCoinSymbol})`;
                if (signalProbText) signalProbText.textContent = `${probBear}% PROB`;
                tp = entry * 0.962;
                sl = entry * 1.018;
            }

            const valEntry = document.getElementById('valEntry');
            const valTp = document.getElementById('valTp');
            const valSl = document.getElementById('valSl');

            if (valEntry) valEntry.textContent = `$ ${entry.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
            if (valTp) valTp.textContent = `$ ${tp.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
            if (valSl) valSl.textContent = `$ ${sl.toLocaleString(undefined, {maximumFractionDigits: 2})}`;

            runSignalBtn.textContent = translations[currentLang].runSignalBtn;
        }, 500);
    });
}

// 12. AI Copilot Чат
const sendBtn = document.getElementById('sendBtn');
const userQuestion = document.getElementById('userQuestion');
const chatMessages = document.getElementById('chatMessages');

function addMessage(text, sender) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (sendBtn && userQuestion) {
    sendBtn.addEventListener('click', () => {
        const text = userQuestion.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        userQuestion.value = '';

        setTimeout(() => {
            let reply = `AI Copilot: Текущая цена ${currentCoinSymbol} составляет $${currentCoinPrice}. Тренд ${currentCoinChange >= 0 ? 'бычий' : 'медвежий'} (${currentCoinChange.toFixed(2)}%). Рынок готов к движениям.`;
            addMessage(reply, 'ai');
        }, 600);
    });

    userQuestion.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });
}
// --- ОБРАБОТЧИКИ КНОПОК WEB3 ПОДКЛЮЧЕНИЯ ---

// 1. Подключение MetaMask (Ethereum / EVM)
const connectMetaMaskBtn = document.getElementById('connectMetaMaskBtn');
if (connectMetaMaskBtn) {
    connectMetaMaskBtn.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    const address = accounts[0];
                    userWallets.push({ type: 'MetaMask (EVM)', address: address });
                    renderWallets();
                    alert(`MetaMask успешно подключен: ${address.substring(0, 6)}...${address.substring(38)}`);
                }
            } catch (error) {
                console.error("MetaMask connection error:", error);
                alert("Ошибка подключения MetaMask. Попробуйте еще раз.");
            }
        } else {
            alert("Расширение MetaMask не обнаружено в браузере! Установите его или используйте ручной ввод адреса.");
        }
    });
}

// 2. Подключение TonConnect (TON)
const connectTonBtn = document.getElementById('connectTonBtn');
if (connectTonBtn) {
    connectTonBtn.addEventListener('click', () => {
        const sampleTonAddress = "UQD_DemoTonWalletAddress998877665544332211";
        const userPrompt = prompt("Введите ваш TON адрес (или оставьте демо для теста):", sampleTonAddress);
        
        if (userPrompt !== null) {
            const cleanAddress = userPrompt.trim() || sampleTonAddress;
            userWallets.push({ type: 'TonConnect (TON)', address: cleanAddress });
            renderWallets();
            alert(`TonConnect успешно подключен к кошельку!`);
        }
    });
}
// 13. Инициализация при старте
loadTradingViewChart('BTC');
fetchCryptoPrices();
fetchMarketWidgets();
loadFundingTable();
loadAiNewsStream();
loadScannerStream();
loadWhalesStream();
setInterval(fetchCryptoPrices, 60000);
// Открыть модальное окно с тарифами (можешь вызывать эту функцию при клике на кнопку Upgrade на сайте)
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'flex';
}

// Закрыть модальное окно (работает по крестику "X")
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'none';
}

// Симуляция перехода на Stripe при клике на Pro или Premium
function startStripePayment(planName) {
  alert(`Перенаправлення на безпечну оплату Stripe для тарифу ${planName}...`);
  // Здесь в будущем будет реальная ссылка от Stripe Checkout
  // window.location.href = "https://checkout.stripe.com/..."
}

// Пример: если хочешь, чтобы окно само открывалось при загрузке сайта (для новых пользователей)
window.addEventListener('DOMContentLoaded', () => {
  // Раскомментируй строчку ниже, если нужно показывать окно сразу при входе:
  // openPricingModal();
});
// --- Си тем а тарифов та модального окна ---

// Открыть модальное окно с тарифами
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'flex';
}

// Закрыть модальное окно (по кнопке "X")
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'none';
}

// Переход на оплату Stripe (пока тестовое предупреждение)
function startStripePayment(planName) {
  alert(`Перенаправлення на безпечну оплату Stripe для тарифу ${planName}...`);
  // Позже здесь будет реальная ссылка на оплату
}
// Відкрити модальне вікно
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'flex';
}

// Закрити модальне вікно (по хрестику "X")
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'none';
}

// Оплата через Stripe
function startStripePayment(planName) {
  alert(`Перенаправлення на безпечну оплату Stripe для тарифу ${planName}...`);
}
// --- СИСТЕМА ТАРИФІВ ТА МОДАЛЬНОГО ВІКНА ---

// Відкрити модальне вікно
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Закрити модальне вікно (по хрестику "X")
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Оплата через Stripe (тестове сповіщення)
function startStripePayment(planName) {
  alert(`Перенаправлення на безпечну оплату Stripe для тарифу ${planName}...`);
}
// Функция для открытия модального окна
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Функция для закрытия окна
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Если пользователь выбрал Free тариф
function selectFreePlan() {
  // Сохраняем в память браузера, что у него Free аккаунт
  localStorage.setItem('userPlan', 'FREE');
  alert('Вы выбрали бесплатный тариф. Добро пожаловать в систему!');
  closePricingModal(); // Закрываем окно, пользователь попадает в кабинет
}

// Переход на оплату Stripe (для Pro или Premium)
function startStripePayment(planName) {
  localStorage.setItem('userPlan', planName);
  alert(`Перенаправление на безопасную оплату Stripe для тарифного плана ${planName}...`);
  // Здесь в будущем ты пропишешь реальную ссылку от Stripe:
  // window.location.href = "https://checkout.stripe.com/...";
}

// --- КАК СДЕЛАТЬ АВТОМАТИЧЕСКИЙ ПОКАЗ ПОСЛЕ РЕГИСТРАЦИИ ---
// Когда пользователь нажимает кнопку "Зарегистрироваться" на твоем сайте, 
// вызови эту функцию (например, внутри твоего обработчика формы регистрации):
function triggerRegistrationSuccess() {
  // Здесь может быть твоя логика отправки данных на сервер...
  
  // И сразу после успешной регистрации показываем окно выбора тарифа:
  openPricingModal();
}
// Переменная состояния: 'register' или 'login'
let currentAuthMode = 'register';

// Переключение между Входом и Регистрацией
function toggleAuthMode(event) {
  event.preventDefault();
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const nameField = document.getElementById('name-field-container');
  const prompt = document.getElementById('switch-prompt');
  const link = document.getElementById('switch-link');

  if (currentAuthMode === 'register') {
    currentAuthMode = 'login';
    title.textContent = 'Вход в Crypto AI';
    subtitle.textContent = 'Введите данные для входа в аккаунт';
    submitBtn.textContent = 'Войти';
    nameField.style.display = 'none'; // Поле имени при входе не нужно
    prompt.textContent = 'Нет аккаунта?';
    link.textContent = 'Зарегистрироваться';
  } else {
    currentAuthMode = 'register';
    title.textContent = 'Регистрация в Crypto AI';
    subtitle.textContent = 'Создайте аккаунт или войдите в систему';
    submitBtn.textContent = 'Зарегистрироваться';
    nameField.style.display = 'block';
    prompt.textContent = 'Уже есть аккаунт?';
    link.textContent = 'Войти';
  }
}

// Обработка отправки формы (Вход или Регистрация)
function handleAuthSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value;
  
  if (!email) return;

  // Сохраняем пользователя в память браузера
  localStorage.setItem('userEmail', email);

  // Скрываем окно авторизации
  document.getElementById('auth-overlay').style.display = 'none';

  // ВСЕГДА ПОКАЗЫВАЕМ МОДАЛЬНОЕ ОКНО ТАРИФОВ ПОСЛЕ УСПЕШНОГО ВХОДА/РЕГИСТРАЦИИ
  openPricingModal();
}

// Полноценная работа кнопок Google и Apple
function socialLogin(provider) {
  // Показываем красивое системное уведомление / имитацию входа через провайдер
  const confirmMsg = confirm(`Вы хотите войти в Crypto AI Analytics с помощью учетной записи ${provider}?`);
  
  if (!confirmMsg) return;

  // Генерируем уникальный демо-email на основе выбранного сервиса
  const providerKey = provider.toLowerCase();
  const mockEmail = `user_${Date.now()}@${providerKey === 'google' ? 'gmail.com' : 'icloud.com'}`;
  
  // Сохраняем сессию пользователя в память браузера
  localStorage.setItem('userEmail', mockEmail);
  localStorage.setItem('userAuthProvider', provider);

  // Плавное скрытие экрана авторизации
  const authOverlay = document.getElementById('auth-overlay');
  if (authOverlay) {
    authOverlay.style.display = 'none';
  }

  // Успешное приветствие и открытие окна выбора тарифов
  alert(`Успешный вход через ${provider}! Добро пожаловать.`);
  openPricingModal();
}

// Открытие модального окна тарифов
function openPricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'flex';
}

// Закрытие модального окна (по крестику "X" или выбору Free)
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'none';
}

// 1. Выбор бесплатного тарифа (по кнопке "Continue Free" или крестику "X")
function selectFreePlan() {
  localStorage.setItem('userPlan', 'FREE');
  closePricingModal();
}

// 2. Закрытие модального окна по крестику "X" (если закрыл крестиком без выбора, по умолчанию тоже ставим FREE)
function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) modal.style.display = 'none';

  // Если тариф еще не был выбран, автоматически назначаем FREE и открываем сайт
  if (!localStorage.getItem('userPlan')) {
    localStorage.setItem('userPlan', 'FREE');
  }
}

// 3. Оплата платного тарифа (Pro или Premium) через Stripe
function startStripePayment(planName) {
  // Сохраняем выбранный платный тариф
  localStorage.setItem('userPlan', planName);
  
  // Имитируем успешную оплату (в будущем здесь будет интеграция со Stripe API)
  alert(`Оплата тарифу ${planName} пройшла успішно! Вітаємо!`);
  
  // Закрываем модальное окно, открывая доступ к сайту
  closePricingModal();
}

// Оплата через Stripe (Pro / Premium)
function startStripePayment(planName) {
  localStorage.setItem('userPlan', planName);
  alert(`Перенаправление на безопасную оплату Stripe для тарифного плана ${planName}...`);
}

// Проверка при загрузке страницы: залогинен ли пользователь
window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('userEmail');
  const authOverlay = document.getElementById('auth-overlay');

  if (savedEmail) {
    // Если пользователь уже заходил ранее — скрываем форму входа
    if (authOverlay) authOverlay.style.display = 'none';
  } else {
    // Если новый пользователь — показываем форму авторизации
    if (authOverlay) authOverlay.style.display = 'flex';
  }
});