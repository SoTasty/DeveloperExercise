let btnLocation = document.getElementById('open_cart_btn');

// Функция для форматирования цены
function formatterCart(priceSum) {
    let price = priceSum.toString();
    let formattedPrice = '';
    for (let i = 0; i < price.length; i++) {
        if (i > 0 && i % 3 === 0) {
            formattedPrice = ' ' + formattedPrice;
        }
        formattedPrice = price[price.length - 1 - i] + formattedPrice;
    }
    return formattedPrice;
}

const initialProducts = [
    {
        code: 6987,
        title: 'Slim DC',
        img: 'images/stul_kresla/GloryDC.png',
        price: 83000,
        quantity: 2
    },
    {
        code: 6203,
        title: 'Hi-tech',
        img: 'images/stul_kresla/Hi-tech.png',
        price: 95500,
        quantity: 1
    }
];

// Получение данных из sessionStorage
function getProducts() {
    const products = sessionStorage.getItem('cartProducts');
    return products ? JSON.parse(products) : initialProducts;
}

// Сохранение данных в sessionStorage
function saveProducts(products) {
    sessionStorage.setItem('cartProducts', JSON.stringify(products));
}

// Функция для создания элемента товара
function createProductElement(product) {
    return `
        <ul class="jqcart_tbody" data-code="${product.code}">
            <li class="jqcart_small_td">
                <img src="${product.img}" alt="Img">
            </li>
            <li>
                <div class="jqcart_nd">
                    <a href="#chair.html">${product.title}</a>
                </div>
            </li>
            <li></li>
            <li class="jqcart_price">${formatterCart(product.price)}</li>
            <li>
                <div class="jqcart_pm">
                    <input type="text" class="jqcart_amount" value="${product.quantity}">
                    <span class="jqcart_incr" data-incr="1">
                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                    </span>
                    <span class="jqcart_incr" data-incr="-1">
                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                    </span>
                </div>
            </li>
            <li class="jqcart_sum">${formatterCart(product.price * product.quantity)} тг</li>
        </ul>
    `;
}

// Функция для отображения корзины
function displayCart() {
    const divElement = document.createElement('div');
    divElement.classList.add('jqcart_layout');

    const products = getProducts();
    let productsHtml = products.map(createProductElement).join('');
    let subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    divElement.innerHTML = `
        <div class="jqcart_content">
            <div class="jqcart_table_wrapper">
                <div class="jqcart_manage_order">
                    <ul class="jqcart_thead">
                        <li></li>
                        <li>ТОВАР</li>
                        <li></li>
                        <li>ЦЕНА</li>
                        <li>КОЛИЧЕСТВО</li>
                        <li>СТОИМОСТЬ</li>
                    </ul>
                    ${productsHtml}
                </div>
            </div>
            <div class="jqcart_manage_block">
                <div class="jqcart_btn">
                    <button class="jqcart_open_form_btn">Оформить заказ</button>
                    <form class="jqcart_order_form" style="opacity: 0">
                        <input class="jqcart_return_btn" type="reset" value="Продолжить покупки">
                    </form>
                </div>
                <div class="jqcart_subtotal">Итого: <strong>${formatterCart(subtotal)}</strong> тг</div>
            </div>
        </div>
    `;

    document.body.appendChild(divElement);

    document.querySelector('.jqcart_layout').addEventListener('click', function (event) {
        const current = event.target
        const jqcart_layout = document.querySelector('.jqcart_layout')
        if (current === jqcart_layout) {
            document.querySelector('.jqcart_layout').remove();
        }
    });

    // Обработка изменения количества товара
    document.querySelectorAll('.jqcart_incr').forEach(button => {
        button.addEventListener('click', function () {
            const listItem = this.closest('.jqcart_tbody');
            const productId = parseInt(listItem.getAttribute('data-code'), 10);
            const quantityInput = listItem.querySelector('.jqcart_amount');
            const price = parseInt(listItem.querySelector('.jqcart_price').textContent.replace(/\s+/g, ''), 10);
            let quantity = parseInt(quantityInput.value, 10) + parseInt(this.getAttribute('data-incr'), 10);
            quantity = Math.max(quantity, 0); // Минимальное значение количества - 0
            quantityInput.value = quantity;
            listItem.querySelector('.jqcart_sum').textContent = formatterCart(price * quantity) + ' тг';

            // Обновление данных товара
            const products = getProducts();
            const product = products.find(p => p.code === productId);
            if (product) {
                product.quantity = quantity;
                if (product.quantity === 0) {
                    // Удалить товар из корзины, если количество стало 0
                    const index = products.findIndex(p => p.code === productId);
                    if (index > -1) products.splice(index, 1);
                }
            }
            saveProducts(products);

            // Обновление общей суммы
            const newSubtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
            document.querySelector('.jqcart_subtotal strong').textContent = formatterCart(newSubtotal);

            // Удаление товара из DOM, если количество стало 0
            if (quantity === 0) {
                listItem.remove();
            }

            productsCount();
        });
    });
}

// Инициализация корзины при нажатии на кнопку
btnLocation.addEventListener('click', displayCart);

// Обновление числа товаров в корзине
function productsCount() {
    const products = getProducts()
    const res = products.reduce((sum, product) => sum + product.quantity, 0);
    document.querySelector('.open_cart_number').textContent = res;
}
productsCount()