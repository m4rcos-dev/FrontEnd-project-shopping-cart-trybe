const round = (num, places) => {
  if (!(`${num}`).includes('e')) {
    return +(`${Math.round(`${num}e+${places}`)}e-${places}`);
  }
  const arr = (`${num}`).split('e');
  let sig = '';
  if (+arr[1] + places > 0) {
    sig = '+';
  }
  return +(`${Math.round(`${+arr[0]}e${sig}${+arr[1] + places}`)}e-${places}`);
};
// Creditos da função acima ao A Kunin, user:1736537 do stackoverflow, apenas modificada do original para as regras do linter e funcionamento na minha aplicação. Função utilizada para trabalhar com casas decimais de forma mais precisa possível.

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

const selectTotalPrice = () => {
  priceContainer = document.querySelector('.total-price');
  return priceContainer;
};

const subtractTotalCart = (event) => {
  const itemCartRemove = event.path[0];
  const priceCapture = itemCartRemove.innerText.split(' ').pop().split('$').pop();
  const priceConvertion = parseFloat(selectTotalPrice().innerText) - parseFloat(priceCapture);
  const priceRound = round(priceConvertion, 2);
  selectTotalPrice().innerText = priceRound;
  localStorage.setItem('total', priceRound);
};
const handleAllLocalStorage = (event) => {
  localStorage.removeItem('cartItems');
  subtractTotalCart(event);
  localStorage.removeItem('total');
};

const removeItemCart = (event) => {
  const itemCartRemove = event.path[0];
  const divRemove = itemCartRemove.parentNode;
  itemCartRemove.remove();
  divRemove.remove();
  if (getSavedCartItems('cartItems').split(',').length === 1) {
    return handleAllLocalStorage(event);
  }
  const idCapture = itemCartRemove.innerText.split(' ')[1];
  const ls = getSavedCartItems('cartItems').split(',');
  const newLs = ls.filter((element) => element !== idCapture);
  saveCartItems(newLs.toString());
  subtractTotalCart(event);
};

const cartItemClickListener = (event) => {
  removeItemCart(event);
};

const itemCartOver = (event) => {
  const divCartContainer = event.path[0];
  const remover = document.createElement('i');
  remover.className = 'fa-solid fa-trash-can';
  divCartContainer.appendChild(remover);
}

const removeItemCartOver = () => {
  const textRemover = document.querySelector('.fa-trash-can');
  textRemover.remove();
}

const createCartItemElement = ({ sku, name, salePrice, img }) => {
  const div = document.createElement('div');
  div.className = 'cart_item_container';
  const image = document.createElement('img');
  image.className = 'cart_item_img';
  image.setAttribute('src', img);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: R$${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  div.appendChild(image);
  div.appendChild(li);
  div.addEventListener('mouseover', itemCartOver);
  div.addEventListener('mouseout', removeItemCartOver);
  return div;
};

const messageCallingApi = () => {
  const cartContainer = document.querySelector('.cart');
  const messageElement = document.createElement('h3');
  messageElement.className = 'loading';
  messageElement.innerText = 'carregando...';
  cartContainer.appendChild(messageElement);
};

const messageLoadPage = () => {
  const containerTitle = document.querySelector('.container-title')
  const messageElement = document.createElement('h3');
  messageElement.className = 'loading';
  messageElement.innerText = 'carregando...'
  containerTitle.appendChild(messageElement);
}

const removeMessageCallingApi = () => {
  const messageContainer = document.querySelector('.loading');
  messageContainer.remove();
};

const searchInput = document.querySelector('.search_input');
const buttonSearch = document.querySelector('.fa-searchengin');
const searchProducts = () => searchInput.value;

const cleanPage = () => {
  const allItemsContainer = document.querySelectorAll('.item');
  allItemsContainer.forEach((e) => {
    e.remove();
  })
};

searchInput.addEventListener('keypress', function (event) {
  if (event.which === 13) {
    cleanPage();
    createIntensHtml(searchProducts());
  }
});

buttonSearch.addEventListener('click', function () {
  cleanPage();
  createIntensHtml(searchProducts());
})

buttonSearch.addEventListener('mouseover', function () {
  buttonSearch.classList.add('fa-beat');
})

buttonSearch.addEventListener('mouseout', function () {
  buttonSearch.classList.remove('fa-beat');
})

const createIntensHtml = async (product) => {
  messageLoadPage();
  const itemsContainer = document.querySelector('.items');
  const data = await fetchProducts(product);
  const { results } = data;
  await results.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    itemsContainer.appendChild(createProductItemElement(item));
  });
  removeMessageCallingApi();
};

const defaultIntensHtml = async () => {
  messageLoadPage();
  const itemsContainer = document.querySelector('.items');
  const data = await fetchProducts('informática');
  const { results } = data;
  await results.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    itemsContainer.appendChild(createProductItemElement(item));
  });
  removeMessageCallingApi();
};

const addItemCartHtml = async (itemID) => {
  const cartContainer = document.querySelector('.cart__items');
  const data = await fetchItem(itemID);
  const { id } = data;
  const { title } = data;
  const { price } = data;
  const { thumbnail } = data;
  const item = {
    sku: id,
    name: title,
    salePrice: price,
    img: thumbnail,
  };
  cartContainer.appendChild(createCartItemElement(item));
};

const addTotalCart = async (itemID) => {
  const data = await fetchItem(itemID);
  const { price } = data;
  const priceConvertion = parseFloat(selectTotalPrice().innerText) + price;
  const priceRound = round(priceConvertion, 2);
  selectTotalPrice().innerText = priceRound;
  localStorage.setItem('total', priceRound);
};

const loadTotalStorage = () => {
  const priceContainer = document.querySelector('.total-price');
  const currentStorage = () => {
    priceContainer.innerText = localStorage.getItem('total');
  };
  if ('total' in localStorage) {
    return currentStorage();
  }
  priceContainer.innerText = 0;
};

const createSumElement = () => {
  const divTotal = document.createElement('div');
  divTotal.className = 'div-total';
  const h3TitleTotal = document.createElement('h3');
  h3TitleTotal.className = 'title-total';
  h3TitleTotal.innerText = 'Total Carrinho: R$'
  const cartContainer = document.querySelector('.cart');
  const elementSum = document.createElement('h3');
  elementSum.className = 'total-price';
  divTotal.appendChild(h3TitleTotal);
  divTotal.appendChild(elementSum);
  cartContainer.appendChild(divTotal);
  loadTotalStorage();
};

const createItemCart = async (event) => {
  if (event.target.classList.contains('item__add')) {
    const idItem = getSkuFromProductItem(event.target.parentNode);
    messageCallingApi();
    await addItemCartHtml(idItem);
    await addTotalCart(idItem);
    removeMessageCallingApi();
    if ('cartItems' in localStorage) {
      return saveCartItems(`${getSavedCartItems('cartItems')},${idItem}`);
    }
    saveCartItems(idItem);
  }
};

const buttonItemAdd = document.querySelector('.container');
buttonItemAdd.addEventListener('click', function async(e) {
  createItemCart(e);
});

const validSplit = () => {
  if ('cartItems' in localStorage) {
    return getSavedCartItems('cartItems').split(',').length;
  }
  return 0;
};

const handleLocalStorage = () => {
  if ('cartItems' in localStorage && validSplit() > 1) {
    const ls = getSavedCartItems('cartItems').split(',');
    return ls.forEach((element) => {
      addItemCartHtml(element);
    });
  } if (validSplit() === 1) {
    return addItemCartHtml(getSavedCartItems('cartItems'));
  }
};

const clearCart = () => {
  if ('cartItems' in localStorage) {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('total');
    window.location.reload();
  }
};

const buttonClear = document.querySelector('.empty-cart');
buttonClear.addEventListener('click', () => clearCart());

window.onload = async () => {
  await defaultIntensHtml();
  await handleLocalStorage();
  await createSumElement();
};
