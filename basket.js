'use strict'

const basketCounterEl = document.querySelector('.cartIconWrap span');
const basketTotalEl = document.querySelector('.basketTotal');
const basketTotalValueEl = document.querySelector('.basketTotalValue');
const basketEl = document.querySelector('.basket');


/* Открываем корзину при нажатии на значок*/
document.querySelector('.cartIconWrap').addEventListener('click', () => {
    basketEl.classList.toggle('hidden');
});

/**
 * В корзине хранится количество каждого товара
 * Ключ это id продукта, значение это товар в корзине - объект, содержащий
 * id, название товара, цену, и количество штук, например:
 * {
 *    1: {id: 1, name: "product 1", price: 30, count: 2},
 *    3: {id: 3, name: "product 3", price: 25, count: 1},
 * }
 */
const basket = {};

/**
 * Далее надо сделать так, чтоб при клике на кнопки "Добавить в корзину"
(в макете "Add to cart"), мы могли обработать добавление в корзину данных.
Для этого я делегировал событие, повесил один обработчик события клика на
ближайшего общего предка всех кнопок, это элемент с классом featuredItems.
Внутри обработчика надо проверить, если мы кликнули не по тому элементу, по
которому нужно было (по кнопке добавить в корзину), то просто возвращаюсь из
функции.
 */

document.querySelector('.featuredItems').addEventListener('click', event => {
    if (event.target.closest('.addToCart')) {
        return;
    }
    /**
     * Если клик был по нужному элементу (по "кнопке"), тогда получаю у родителя с
    классом featuredItem данные из data-атрибутов, которые ставили в п.3. И вызываю
    созданную мной функцию addToCart, в которой происходит добавление продукта.
     */
    const featuredItemEl = event.target.closest('.featuredItem');
    const id = + featuredItemEl.dataset.id;
    const name = featuredItemEl.dataset.name;
    const price = + featuredItemEl.dataset.price;
    addToCart(id, name, price);
});

/**
 * Функция addToCart должна:
8.1. В объект basket добавить новый продукт или изменить имеющийся.
 */

/**
 * @param {number} id - id товара
 * @parem {string} name - название товара
 * @param {number} price - цена за единицу
 */

function addToCart(id, name, price) {
    if (!(id in basket)) {
        basket[id] = { id: id, name: name, price: price, count: 0 }
    }
    // Добавляем в количество +1 к товарам.
    basket[id].count++;
    // Ставим новое количество добавленных товаров у значка корзины.
    basketCounterEl.textContent = getTotalBasketCount().toString();
    // Ставим новую общую стоимость товаров в корзине.
    basketTotalValueEl.textContent = getTotalBasketPrice().toFixed(2);
    // Отрисовываем продукт с данным id.
    paintProductInBasket(id);
}

/**
 * Считает и возвращает количество продуктов в корзине.
 * @return {number} - Количество продуктов в корзине.
 */
function getTotalBasketCount() {
    return Object.values(basket).reduce((acc, product) => acc + product.count, 0);
}

/**
 * Считает и возвращает итоговую цену по всем добавленным продуктам.
 * @return {number} - Итоговую цену по всем добавленным продуктам.
 */
function getTotalBasketPrice() {
    return Object.values(basket)
        .reduce((acc, product) => acc + product.price * product.count, 0);
}

/**
 * Отрисовывает в корзину информацию о товаре.
 * @param {number} Id - Id .
 */
function paintProductInBasket(Id) {
    const basketRowEl = basketEl.querySelector(`.basketRow[data-id="${Id}"]`);
    // Иcключение
    if (!basketRowEl) {
        paintNewProductInBasket(Id);
        return;
    }

    // Получаем данные о продукте из объекта корзины, где хранятся данные о всех
    // добавленных продуктах.
    const product = basket[Id];
    // Ставим новое количество в строке продукта корзины.
    basketRowEl.querySelector('.productCount').textContent = product.count;
    // Ставим нужную итоговую цену по данному продукту в строке продукта корзины.
    basketRowEl
        .querySelector('.productTotalRow')
        .textContent = (product.price * product.count).toFixed(2);
}

/**
 * Функция отрисовывает новый товар в корзине.
 * @param {number} Id - Id товара.
 */
function paintNewProductInBasket(Id) {
    const productRow = `
      <div class="basketRow" data-id="${Id}">
        <div>${basket[Id].name}</div>
        <div>
          <span class="productCount">${basket[Id].count}</span> шт.
        </div>
        <div>$${basket[Id].price}</div>
        <div>
          $<span class="productTotalRow">${(basket[Id].price * basket[Id].count).toFixed(2)}</span>
        </div>
      </div>
      `;
    basketTotalEl.insertAdjacentHTML("beforebegin", productRow);
}
