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

document.addEventListener('DOMContentLoaded', loadItems)