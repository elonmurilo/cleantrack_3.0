document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const appShell = document.getElementById('app-shell');
    const mainContent = document.getElementById('main-content');
    const menuToggle = document.getElementById('menu-toggle');
    const floatingMenu = document.getElementById('floating-menu');
    const pageTitle = document.getElementById('page-title');
    const userInitials = document.getElementById('user-initials');
    const menuItems = document.querySelectorAll('#floating-menu li');
    const logoutBtn = document.getElementById('logout-btn');

    // State
    let currentView = 'home';

    // Initialize
    const init = () => {
        // Set user data
        userInitials.textContent = mockData.currentUser.avatarInitial;

        // Setup Login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });

        // Setup Menu Toggle
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            floatingMenu.classList.add('hidden');
        });

        // Navigation
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = item.getAttribute('data-view');
                if (view) {
                    navigateTo(view);

                    // Update active class
                    menuItems.forEach(mi => mi.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });

        // Setup Logout
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLogout();
        });
    };

    // Handlers
    const handleLogin = () => {
        // Simular loading
        const btn = loginForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Carregando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            loginScreen.classList.add('hidden');
            appShell.classList.remove('hidden');
            renderView('home');
        }, 800);
    };

    const handleLogout = () => {
        const result = window.confirm('Deseja realmente sair?');
        if (result) {
            window.location.href = "./index.html";
        }
    };

    const navigateTo = (view) => {
        currentView = view;
        const titles = {
            'home': 'Olá, ' + mockData.currentUser.name,
            'clientes': 'Clientes',
            'servicos': 'Serviços',
            'faturamento': 'Faturamento'
        };
        pageTitle.textContent = titles[view] || 'CleanTrack';
        renderView(view);
    };

    const renderView = (view) => {
        mainContent.innerHTML = ''; // Limpar conteúdo atual

        switch (view) {
            case 'home':
                renderHome();
                break;
            case 'clientes':
                renderClientes();
                break;
            case 'servicos':
                renderServicos();
                break;
            case 'faturamento':
                renderFaturamento();
                break;
        }
    };

    // View Renderers
    const renderHome = () => {
        const { summary, clients } = mockData;

        const html = `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-info">
                        <span class="card-label">Total de Clientes</span>
                        <span class="card-value">${summary.totalClients.value}</span>
                        <span class="card-growth">${summary.totalClients.growth}</span>
                    </div>
                    <div class="card-icon icon-clients"><i class="fa-solid fa-users"></i></div>
                </div>
                <div class="card">
                    <div class="card-info">
                        <span class="card-label">Serviços Hoje</span>
                        <span class="card-value">${summary.servicesToday.value}</span>
                        <span class="card-status">${summary.servicesToday.status}</span>
                    </div>
                    <div class="card-icon icon-services"><i class="fa-solid fa-calendar-check"></i></div>
                </div>
                <div class="card">
                    <div class="card-info">
                        <span class="card-label">Faturamento Mensal</span>
                        <span class="card-value">${summary.monthlyBilling.value}</span>
                        <span class="card-growth">${summary.monthlyBilling.growth}</span>
                    </div>
                    <div class="card-icon icon-billing"><i class="fa-solid fa-dollar-sign"></i></div>
                </div>
            </div>

            <h3 class="section-title">Clientes Recentes</h3>
            <div class="list-container">
                ${clients.slice(0, 3).map(client => `
                    <div class="list-item">
                        <div class="avatar" style="background-color: ${client.color}">${client.initials}</div>
                        <div class="item-details">
                            <span class="item-name">${client.name}</span>
                            <span class="item-subtext">${client.vehicle}</span>
                            <span class="item-subtext">${client.lastVisit}</span>
                        </div>
                        <button class="btn-action" onclick="alert('Agendando para ${client.name}...')">
                            Agendar <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        mainContent.innerHTML = html;
    };

    const renderClientes = () => {
        const { summary, clients } = mockData;
        const html = `
            <div class="card">
                <div class="card-info">
                    <span class="card-label">Total de Clientes</span>
                    <span class="card-value">${summary.totalClients.value}</span>
                    <span class="card-growth">${summary.totalClients.growth}</span>
                </div>
                <div class="card-icon icon-clients"><i class="fa-solid fa-users"></i></div>
            </div>

            <div class="list-grid">
                ${clients.map(client => `
                    <div class="list-item">
                        <div class="avatar" style="background-color: ${client.color}">${client.initials}</div>
                        <div class="item-details">
                            <span class="item-name">${client.name}</span>
                            <span class="item-subtext">${client.vehicle}</span>
                            <span class="item-subtext">${client.lastVisit}</span>
                        </div>
                        <button class="btn-action" onclick="alert('Agendando para ${client.name}...')">
                            Agendar <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        mainContent.innerHTML = html;
    };

    const renderServicos = () => {
        const { summary, services } = mockData;
        const html = `
            <div class="card">
                <div class="card-info">
                    <span class="card-label">Serviços Hoje</span>
                    <span class="card-value">${summary.servicesToday.value}</span>
                    <span class="card-status">${summary.servicesToday.status}</span>
                </div>
                <div class="card-icon icon-services"><i class="fa-solid fa-calendar-check"></i></div>
            </div>

            <div class="list-grid">
                ${services.map(service => `
                    <div class="list-item">
                        <div class="avatar" style="background-color: #EEE">${service.client.charAt(0)}</div>
                        <div class="item-details">
                            <span class="item-name">${service.client}</span>
                            <span class="item-subtext">${service.vehicle}</span>
                            <span class="item-subtext">${service.type}</span>
                        </div>
                        <button class="btn-action" style="background: var(--primary-gold)">
                            ${service.time} <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        mainContent.innerHTML = html;
    };

    const renderFaturamento = () => {
        const { summary, billingChart } = mockData;
        const html = `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-info">
                        <span class="card-label">Faturamento Mensal</span>
                        <span class="card-value">${summary.monthlyBilling.value}</span>
                        <span class="card-growth">${summary.monthlyBilling.growth}</span>
                    </div>
                    <div class="card-icon icon-billing"><i class="fa-solid fa-dollar-sign"></i></div>
                </div>
                <div class="card">
                    <div class="card-info">
                        <span class="card-label">Mês Anterior</span>
                        <span class="card-value">${summary.lastMonthBilling.value.replace('R$ ', '')}</span>
                        <span class="card-growth">${summary.lastMonthBilling.growth}</span>
                    </div>
                    <div class="card-icon icon-billing"><i class="fa-solid fa-dollar-sign"></i></div>
                </div>
            </div>

            <div class="chart-container">
                 <h3 style="font-size: 0.9rem; text-align: center; margin-bottom: 1.5rem; color: #333;">Projeção de Faturamento Automotivo — 2026</h3>
                 <div class="chart-bars">
                    ${billingChart.map(data => `
                        <div class="bar-wrapper">
                            <div class="bar" style="height: ${data.value / 3.5}%; background-color: ${data.color}" 
                                 onmouseover="showTooltip(event, 'R$ ${data.value}M')" 
                                 onmouseout="hideTooltip()"></div>
                            <span class="bar-label">${data.month}</span>
                        </div>
                    `).join('')}
                 </div>
                 <div class="chart-y-label" style="font-size: 0.6rem; color: #999; margin-top: 1.5rem;">Valor (R$ Milhões)</div>
            </div>
            <div id="tooltip" class="chart-tooltip"></div>
        `;
        mainContent.innerHTML = html;
    };

    // Tooltip functions (Global for simple inline usage)
    window.showTooltip = (event, text) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = text;
        tooltip.style.opacity = '1';
        tooltip.style.left = (event.clientX - appShell.offsetLeft) + 'px';
        tooltip.style.top = (event.clientY - appShell.offsetTop - 30) + 'px';
    };

    window.hideTooltip = () => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.opacity = '0';
    };

    // Run init
    init();
});
