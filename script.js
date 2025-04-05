document.addEventListener('DOMContentLoaded', async () => {

    const loadedItems = await loadItems()

    orderScreenOverlay();
    addToCartButtonSelected(loadedItems);
});

async function loadItems() {
    try {
        const response = await fetch('data.json')
        if (!response.ok) {
            throw new Error('Failed to load items');
        }
        const data_desserts = await response.json()

        const desserts_list = document.querySelector('#desserts-list');
        desserts_list.innerHTML = '';

        data_desserts.forEach((item, index) => {

            const li = document.createElement('li');

            li.innerHTML = `
            
                <article>

                    <div class="image-div">
                        <img src="${item.image.desktop}">

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

            desserts_list.appendChild(li);

        });

        return data_desserts;

    } catch (error) {
        console.error(error);
        return [];
    }
}

function orderScreenOverlay() {

    const orderButton = document.getElementById('cart-button')
    const overlay = document.getElementById('order-overlay-div')
    const closeOverlay = document.querySelector('.new-order-button')

    orderButton.addEventListener('click', () => {
        overlay.style.display = 'flex'
        document.body.style.overflow = 'hidden'
    });

    closeOverlay.addEventListener('click', () => {
        overlay.style.display = 'none'
        document.body.style.overflow = 'auto'
    });

}

function addToCartButtonSelected(itemsData) {
    
    const cartItems = {};

    document.querySelector('#desserts-list').addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('add-to-cart-button') && 
            !target.classList.contains('selected')) {
            
            const itemIndex = target.getAttribute('data-index');
            cartItems[itemIndex] = 1; 
            
            transformToQuantityControl(target, itemIndex);
            highlightItem(target);
            console.log('Quantidades atualizadas:', cartItems);
        }
        
        if (target.closest('.icon-plus, .icon-minus')) {
            const button = target.closest('.add-to-cart-button.selected');
            const itemIndex = button.getAttribute('data-index');
            const quantitySpan = button.querySelector('.quantity-value');
            
            if (target.closest('.icon-plus')) {
                cartItems[itemIndex] += 1;
            } else if (cartItems[itemIndex] > 1) {
                cartItems[itemIndex] -= 1;
            }
            
            quantitySpan.textContent = cartItems[itemIndex];
            console.log('Quantidades atualizadas:', cartItems);
        }
    });

    function transformToQuantityControl(button, itemIndex) {
        button.classList.add('selected');
        button.innerHTML = `
            <svg class="icon-minus" width="10" height="2" viewBox="0 0 10 2">
                <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z"/>
            </svg>
            <span class="quantity-value">1</span>
            <svg class="icon-plus" width="10" height="10" viewBox="0 0 10 10">
                <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
            </svg>
        `;
    }

    function highlightItem(button) {
        const img = button.closest('.image-div').querySelector('img');
        img.style.outline = '2px solid red';
        img.style.outlineOffset = '2px';
    }
}
