// const { fetchProducts } = require('./helpers/fetchProducts');

// const { fetchItem } = require("./helpers/fetchItem");

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  const itemCartRemove = event.path[0];
  itemCartRemove.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createIntensHtml = async () => {
  const itemsContainer = document.querySelector('.items');
  const data = await fetchProducts('computador');
  const { results } = data;
  await results.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    itemsContainer.appendChild(createProductItemElement(item));
  });
};

const addItemCartHtml = async (itemID) => {
  const cartContainer = document.querySelector('.cart__items');
  const data = await fetchItem(itemID);
  const { id } = data;
  const { title } = data;
  const { price } = data;
  const item = {
    sku: id,
    name: title,
    salePrice: price,
  };
  cartContainer.appendChild(createCartItemElement(item));
};

const buttonItemAdd = document.querySelector('.container');
buttonItemAdd.addEventListener('click', function (e) {
  if (e.target.classList.contains('item__add')) {
    const idItem = getSkuFromProductItem(e.target.parentNode);
    addItemCartHtml(idItem);
  }
});

window.onload = () => {
  createIntensHtml();
};