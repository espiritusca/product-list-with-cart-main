// Variáveis globais para armazenamento dos dados
let cartItems = [];
let itemsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    itemsData = await loadItems();
    addToCartButtonSelected();
    orderScreenOverlay();
});

async function loadItems() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load items');
        
        const data = await response.json();
        const dessertsList = document.querySelector('#desserts-list');
        dessertsList.innerHTML = '';

        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <article>
                    <div class="image-div">
                        <img src="${item.image.desktop}" alt="${item.name}">
                        <button class="add-to-cart-button" type="button" data-index="${index}">
                            Add to Cart
                        </button>
                    </div>
                    <div class="item-details-div">
                        <p class="item-category">${item.category}</p>
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">$${item.price}</p>
                    </div>
                </article>
            `;
            dessertsList.appendChild(li);
        });

        return data;
    } catch (error) {
        console.error('Error loading items:', error);
        return [];
    }
}

function addToCartButtonSelected() {
    const cartSection = document.querySelector('.cart-section');
    const emptyCartFigure = document.querySelector('.empty-cart-figure');

    // Inicializa elementos do carrinho se não existirem
    if (!document.querySelector('.total-order-div')) {
        // Remove a figura temporariamente para garantir a ordem correta
        if (emptyCartFigure) {
            emptyCartFigure.remove();
        }
        
        cartSection.innerHTML += `
            <div class="total-order-div" style="display: none;">
                <span class="total-order-text-span">Order Total</span>
                <span class="total-order-span">$0.00</span>
            </div>
            <div class="carbon-neutral-div" style="display: none;">
                <img src="assets/images/icon-carbon-neutral.svg" alt="Carbon-Neutral">
                <p>This is a <strong>carbon-neutral</strong> delivery</p>
            </div>
            <button id="cart-button" type="button" style="display: none;">Confirm Order</button>
        `;
        
        // Recoloca a figura no final
        if (emptyCartFigure) {
            cartSection.appendChild(emptyCartFigure);
        }
    }

    // Função para atualizar a exibição do carrinho
    function updateCartDisplay() {
        // 1. Verifica se há itens
        const hasItems = cartItems.length > 0;
        
        // 2. Controle PRINCIPAL da figura do carrinho vazio
        if (emptyCartFigure) {
            emptyCartFigure.style.display = hasItems ? 'none' : 'flex';
            
            // Garante que a figure esteja no final quando há itens
            if (hasItems && emptyCartFigure.parentNode) {
                emptyCartFigure.parentNode.appendChild(emptyCartFigure);
            }
        }
        
        // 3. Controle dos outros elementos
        document.querySelector('.total-order-div').style.display = hasItems ? 'flex' : 'none';
        document.querySelector('.carbon-neutral-div').style.display = hasItems ? 'flex' : 'none';
        document.getElementById('cart-button').style.display = hasItems ? 'block' : 'none';
        document.querySelector('.number-items-span').textContent = `(${cartItems.reduce((sum, item) => sum + item.quantity, 0)})`;

        // 4. Limpa itens existentes
        document.querySelectorAll('.item-cart-article').forEach(el => el.remove());

        // 5. Adiciona os itens atuais
        if (hasItems) {
            let total = 0;
            const fragment = document.createDocumentFragment();
            
            cartItems.forEach(item => {
                const itemTotal = item.quantity * item.price;
                total += itemTotal;

                const article = document.createElement('article');
                article.className = 'item-cart-article';
                article.innerHTML = `
                    <div class="details-item-cart-div">
                        <p class="item-cart-name-p">${item.name}</p>
                        <span class="unit-count-span">${item.quantity}x</span>
                        <span class="unit-value-span">@$${item.price.toFixed(2)}</span>
                        <span class="sub-total-cart-item-span">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="remove-icon-cart-div">
                        <svg class="remove-item-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                        </svg>
                    </div>
                `;

                article.querySelector('.remove-icon-cart-div').addEventListener('click', () => {
                    removeItemFromCart(item.id, item.index);
                });

                fragment.appendChild(article);
            });

            // Insere os itens antes do total-order-div
            const totalOrderDiv = document.querySelector('.total-order-div');
            if (totalOrderDiv) {
                cartSection.insertBefore(fragment, totalOrderDiv);
            }
            
            // Atualiza o total
            document.querySelector('.total-order-span').textContent = `$${total.toFixed(2)}`;
        }
    }

    // Função para remover item do carrinho
    function removeItemFromCart(itemId, itemIndex) {
        const index = cartItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            cartItems.splice(index, 1);
            
            // Reseta o botão no cardápio
            const button = document.querySelector(`.add-to-cart-button[data-index="${itemIndex}"]`);
            if (button) {
                button.classList.remove('selected');
                button.innerHTML = 'Add to Cart';
                const img = button.closest('.image-div').querySelector('img');
                img.style.outline = 'none';
            }
            
            updateCartDisplay();
        }
    }

    document.querySelector('#desserts-list').addEventListener('click', (e) => {
        const target = e.target;
        
        // Adiciona ao carrinho
        if (target.classList.contains('add-to-cart-button') && !target.classList.contains('selected')) {
            const itemIndex = target.getAttribute('data-index');
            const item = itemsData[itemIndex];
            
            // Verifica se o item já está no carrinho
            const existingItem = cartItems.find(item => item.index == itemIndex);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: `item-${Date.now()}-${itemIndex}`,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: 1,
                    index: parseInt(itemIndex)
                });
            }
            
            transformToQuantityControl(target, itemIndex);
            highlightItem(target);
            updateCartDisplay();
        }
        
        // Controle de quantidade
        if (target.closest('.icon-plus, .icon-minus')) {
            const button = target.closest('.add-to-cart-button.selected');
            if (!button) return;
            
            const itemIndex = button.getAttribute('data-index');
            const cartItem = cartItems.find(item => item.index == itemIndex);
            
            if (!cartItem) return;
            
            if (target.closest('.icon-plus')) {
                cartItem.quantity += 1;
            } else if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                removeItemFromCart(cartItem.id, cartItem.index);
                return;
            }
            
            button.querySelector('.quantity-value').textContent = cartItem.quantity;
            updateCartDisplay();
        }
    });

    // Funções auxiliares
    function transformToQuantityControl(button, itemIndex) {
        const cartItem = cartItems.find(item => item.index == itemIndex);
        if (!cartItem) return;
        
        button.classList.add('selected');
        button.setAttribute('data-index', itemIndex);
        button.innerHTML = `
            <svg class="icon-minus" width="10" height="2" viewBox="0 0 10 2">
                <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z"/>
            </svg>
            <span class="quantity-value">${cartItem.quantity}</span>
            <svg class="icon-plus" width="10" height="10" viewBox="0 0 10 10">
                <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
            </svg>
        `;
    }

    function highlightItem(button) {
        const img = button.closest('.image-div').querySelector('img');
        if (img) {
            img.style.outline = '2px solid red';
            img.style.outlineOffset = '2px';
        }
    }

    // Inicialização
    updateCartDisplay();
}

function orderScreenOverlay() {
    const orderButton = document.getElementById('cart-button');
    const overlay = document.getElementById('order-overlay-div');
    const closeOverlay = document.querySelector('.new-order-button');
    const orderScreenSection = document.querySelector('.order-screen-section')

    function updateOrderOverlay() {
        const ordersSection = document.querySelector('.orders-overlay-section');
        ordersSection.innerHTML = '';
        
        let total = 0;
        cartItems.forEach(item => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            
            const article = document.createElement('article');
            article.className = 'order-article';
            article.innerHTML = `
                <img src="${itemsData[item.index].image.desktop}" alt="${item.name}">
                <div class="details-overlay-div">
                    <p class="item-name">${item.name}</p>
                    <span class="count-span">${item.quantity}x</span>
                    <span class="price-span">@ $${item.price.toFixed(2)}</span>
                </div>
                <p class="sub-total-item-p">$${itemTotal.toFixed(2)}</p>
            `;
            ordersSection.appendChild(article);
        });
        
        const orderTotalDiv = document.querySelector('.order-total-div')
        orderTotalDiv.innerHTML = `
            <span>Order Total</span>
            <strong>$${total.toFixed(2)}</strong>
        `;
        
    }

    if (orderButton && overlay && closeOverlay) {
        orderButton.addEventListener('click', () => {
            updateOrderOverlay();
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        closeOverlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            location.reload();
        });
    }
}