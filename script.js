document.addEventListener('DOMContentLoaded', async () => {
    
    await loadItems();
    
    orderScreenOverlay();
    addToCartButtonSelected();
});

async function loadItems() {
    try {
        const response = await fetch('data.json')
        if (!response.ok) {
            throw new Error('Failed to load items');
        }
        const data_desserts = await response.json()

        const desserts_list = document.querySelector('#desserts-list');
        
        data_desserts.forEach(item => {
            
            const li = document.createElement('li');

            li.innerHTML = `
            
                <article>

                    <div class="image-div">
                        <img src="${item.image.desktop}">

                        <button class="add-to-cart-button" type="button">
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

    } catch(error) {
        console.error(error);
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

function addToCartButtonSelected() {

    document.querySelector('#desserts-list').addEventListener('click', (e) => {
        const addToCartButton = e.target.closest('.add-to-cart-button');
        if (!addToCartButton) return;
    
        const imageDiv = addToCartButton.closest('.image-div');
        const image = imageDiv.querySelector('img');

        image.style.outline = '2px solid var(--font-red-color)';
        image.style.outlineOffSet = '0';

        const parentDiv = addToCartButton.parentElement; 
    
        
        const selectedButton = document.createElement('button');
        selectedButton.className = 'add-to-cart-button selected';
        selectedButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z"/>
            </svg>
            <span>1</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
            </svg>
        `;
    
        parentDiv.replaceChild(selectedButton, addToCartButton);
    });

}

