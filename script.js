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
    const closeButton = document.querySelector('.new-order-button')

orderButton.addEventListener('click', () => {
    overlay.style.display = 'flex'
    document.body.style.overflow = 'hidden'
});

closeButton.addEventListener('click', () => {
    overlay.style.display = 'none'
    document.body.style.overflow = 'auto'
});

}

document.addEventListener('DOMContentLoaded', loadItems)

orderScreenOverlay()

