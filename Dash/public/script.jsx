// --- GUARDIÁN DE AUTENTICACIÓN ---
// Se asegura de que si no estás logueado, te envíe a login.html.
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DE AUTENTICACIÓN Y USUARIO ---
    
    // 1. Mostrar el nombre de usuario
    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = username || 'Usuario';
    document.getElementById('welcome-username').textContent = username || 'Usuario';
    
    document.querySelector('.logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });
    


    // --- LÓGICA DEL PANEL ---
    
    let cart = [];
    let shopInitialized = false;

    const contentSections = document.querySelectorAll('.content-section');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const navTriggers = document.querySelectorAll('.nav-trigger');
    const cartCountBadge = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    function switchSection(targetId) {
        contentSections.forEach(section => section.classList.add('hidden'));
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.target === targetId);
        });
        if (targetId === 'tienda-section' && !shopInitialized) {
            initializeShop();
            shopInitialized = true;
        }
        if (targetId === 'facturacion-section') {
            renderCart();
        }
    }

    // --- NUEVA LÓGICA PARA CARGAR SERVIDORES ---
    async function fetchAndDisplayServers() {
        const container = document.getElementById('server-list');
        if (!container) return;

        const pteroUserId = localStorage.getItem('pteroUserId');
        if (!pteroUserId) {
            container.innerHTML = `<div class="card error-card"><p>No se encontró el ID de Pterodactyl. Por favor, vuelve a iniciar sesión.</p></div>`;
            return;
        }

        container.innerHTML = '<p>Cargando servidores...</p>'; 

        try {
            const response = await fetch('/api/get-servers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pteroUserId: pteroUserId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.statusText}`);
            }
            const servers = await response.json();
            
            container.innerHTML = ''; // Limpiamos el mensaje de "Cargando..."

            if (servers.length === 0) {
                container.innerHTML = '<p>No tienes servidores asignados en tu cuenta.</p>';
                return;
            }

            servers.forEach(server => {
                const isOnline = server.is_online === 'running';
                const statusClass = isOnline ? 'online' : 'offline';
                const disabledClass = !isOnline ? 'disabled' : '';
                const pterodactylPanelUrl = 'https://panel.deltaservice.xyz'; 

                const serverCardHTML = `
                    <div class="card server-card">
                        <div class="server-details">
                            <div class="server-name">
                                <span class="status-dot ${statusClass}"></span>
                                <a href="${pterodactylPanelUrl}/server/${server.id}" target="_blank">${server.name}</a>
                            </div>
                            <div class="server-info">
                                <span>${server.ip}:${server.port}</span>
                            </div>
                        </div>
                        <div class="server-actions">
                            <!-- Los botones de acción ahora solo tienen el de administrar -->
                            <a href="${pterodactylPanelUrl}/server/${server.id}" target="_blank" class="action-btn primary" title="Administrar Servidor"><i class="fa-solid fa-cog"></i> Administrar</a>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', serverCardHTML);
            });

        } catch (error) {
            console.error('Error al cargar los servidores:', error);
            container.innerHTML = `<div class="card error-card"><p><strong>Error al cargar servidores:</strong> ${error.message}</p></div>`;
        }
    }

    function renderCart() {
        const cartSummary = document.getElementById('cart-summary');
        if (!cartItemsContainer || !cartSummary) return;
        
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div id="cart-empty-msg"><i class="fa-solid fa-cart-shopping"></i><p>Tu cesta está vacía</p></div>`;
            cartSummary.classList.add('hidden');
        } else {
            cartSummary.classList.remove('hidden');
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `<div class="item-details"><h4>${item.name}</h4><p>${item.price.toFixed(2)}€</p></div><button class="btn-icon cart-item-remove" data-id="${item.id}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>`;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        updateCartSummary();
        updateCartIcon();
        if(shopInitialized) updateAllAddToCartButtons();
    }

    function updateCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        if(!cartSummary) return;
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const iva = subtotal * 0.21;
        const total = subtotal + iva;
        document.getElementById('cart-subtotal').textContent = `${subtotal.toFixed(2)}€`;
        document.getElementById('cart-iva').textContent = `${iva.toFixed(2)}€`;
        document.getElementById('cart-total').textContent = `${total.toFixed(2)}€`;
    }

    function updateCartIcon() {
        if(cartCountBadge) cartCountBadge.textContent = cart.length;
    }

    function addToCart(item) {
        if (!cart.some(cartItem => cartItem.id === item.id)) {
            cart.push(item);
            renderCart();
        }
    }

    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        renderCart();
    }
    
    function updateAllAddToCartButtons() {
        const customPlanButton = document.getElementById('add-custom-plan-btn');
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            const itemId = btn.dataset.id;
            updateButtonState(btn, cart.some(item => item.id === itemId));
        });
        if(customPlanButton && shopInitialized) {
            const { id } = calculateCustomPlan();
            updateButtonState(customPlanButton, cart.some(item => item.id === id));
        }
    }

    function updateButtonState(button, isInCart) {
        if(!button) return;
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        if (isInCart) {
            button.classList.add('added-to-cart');
            if(icon) icon.className = 'fa-solid fa-check';
            if (text) text.textContent = 'Añadido';
            button.disabled = true;
        } else {
            button.classList.remove('added-to-cart');
            if(icon) icon.className = 'fa-solid fa-cart-plus';
            if (text) {
                if (button.dataset.originalText) {
                    text.textContent = button.dataset.originalText;
                } else {
                    text.textContent = 'Contratar';
                }
            }
            button.disabled = false;
        }
    }

    let cpuSlider, ramSlider, storageSlider;
    
    const calculateCustomPlan = () => {
        if (!cpuSlider) return { price: 0, id: 'custom-0-0-0', config: {} };
        const cpu = parseInt(cpuSlider.value);
        const ram = parseInt(ramSlider.value);
        const storage = parseInt(storageSlider.value);
        const price = (cpu * 2.50) + (ram * 1.50) + (storage * 0.08);
        const id = `custom-${cpu}-${ram}-${storage}`;
        return { price, id, config: { cpu, ram, storage } };
    };
    
    function initializeShop() {
        cpuSlider = document.getElementById('cpu-slider');
        ramSlider = document.getElementById('ram-slider');
        storageSlider = document.getElementById('storage-slider');
        const customPlanButton = document.getElementById('add-custom-plan-btn');
        
        const updateCustomPlanDisplay = () => {
            const customPriceEl = document.getElementById('custom-price');
            const cpuValueSpan = document.getElementById('cpu-value');
            const ramValueSpan = document.getElementById('ram-value');
            const storageValueSpan = document.getElementById('storage-value');
            const { price, config } = calculateCustomPlan();
            
            if(customPriceEl) customPriceEl.textContent = `${price.toFixed(2)}€`;
            if (cpuValueSpan) cpuValueSpan.textContent = `${config.cpu} Core${config.cpu > 1 ? 's' : ''}`;
            if (ramValueSpan) ramValueSpan.textContent = `${config.ram} GB`;
            if (storageValueSpan) storageValueSpan.textContent = `${config.storage} GB`;

            updateAllAddToCartButtons();
        };

        [cpuSlider, ramSlider, storageSlider].forEach(slider => { slider?.addEventListener('input', updateCustomPlanDisplay); });
        
        document.querySelectorAll('#tienda-section .add-to-cart-btn').forEach(btn => { 
            const span = btn.querySelector('span');
            if (span) { btn.dataset.originalText = span.textContent; }
            btn.addEventListener('click', () => { addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: parseFloat(btn.dataset.price) }); }); 
        });

        if(customPlanButton) { 
            const span = customPlanButton.querySelector('span');
            if (span) { customPlanButton.dataset.originalText = span.textContent; }
            customPlanButton.addEventListener('click', () => { 
                const { price, id, config } = calculateCustomPlan(); 
                addToCart({ id, name: 'Plan Personalizado', price, isCustom: true, config }); 
            }); 
        }
        updateCustomPlanDisplay();
    }
    
  
    // --- LISTENERS GLOBALES E INICIALIZACIÓN ---
    [...sidebarLinks, ...navTriggers].forEach(link => { 
        if(link) {
            link.addEventListener('click', e => { 
                e.preventDefault(); 
                if(e.currentTarget.dataset.target) {
                    switchSection(e.currentTarget.dataset.target); 
                }
            });
        }
    });
    
    cartItemsContainer?.addEventListener('click', e => {
        if (e.target.closest('.cart-item-remove')) {
            removeFromCart(e.target.closest('.cart-item-remove').dataset.id);
        }
    });

 
    // --- INICIALIZACIÓN ---
    switchSection(document.querySelector('.sidebar-nav .nav-link.active')?.dataset.target || 'dashboard-section');
    fetchAndDisplayServers();
});
