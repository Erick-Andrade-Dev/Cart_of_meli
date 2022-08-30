function imageProduct(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
  }
  
  function customElem(element, className, innerText) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    return e;
  }
  
  async function sumPrice() {
    const getP = document.querySelector('.total-price');
    let sum = 0;
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const getCarItem = document.querySelectorAll('.cart__item');
    getCarItem.forEach((li) => {  
      console.log(li);      
      const price = li.innerText.split('$')[1]; 
      console.log(price);  
      sum += Number(price);
    });  
    getP.innerHTML = sum;
  }
  
  async function clickItem(event) {  
    event.target.remove();  
    // eslint-disable-next-line sonarjs/no-duplicate-string
    // const getListComplete = document.querySelector('.cart__items');
    const getOls = document.querySelectorAll('.cart__item');
    localStorage.saveItensCar = '';  
    await sumPrice();
  }
  
  function productId({ id: sku, title: name, price: salePrice }) {  
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const getOl = document.querySelector('.cart__items');  
    const li = document.createElement('li');
    getOl.appendChild(li);
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', clickItem);
    return li;
  }
  
  async function loadingApi() {  
    const createDiv = document.createElement('div');
    const createH3 = document.createElement('h3');
    const captureBody = document.querySelector('body');
  
    createDiv.classList.add('div-loading');  
    createH3.classList.add('loading');  
    createH3.innerText = 'Loading...';  
  
    createDiv.appendChild(createH3);
    captureBody.appendChild(createDiv);   
  }
  
  function removeItem() {
    const getDivLoading = document.querySelector('.div-loading');
    getDivLoading.remove();
  }
  
  async function addItem(id) {  
    const ENDPOINT = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(ENDPOINT);  
    const data = await response.json();  
    const result = productId(data);
    const captureOl = document.querySelector('.cart__items');
    captureOl.appendChild(result);
    localStorage.setItem('saveItensCar', captureOl.innerHTML);   
    await sumPrice();
  }
  
  const addCarItem = async (event) => {  
    const idOfProducts = event.target.parentNode.firstChild.innerText;   
    addItem(idOfProducts);   
  }; 
  
  function createElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';
    const getOl = document.querySelector('.items');
    
    getOl.appendChild(section);
    section.appendChild(customElem('span', 'item__sku', sku));
    section.appendChild(customElem('span', 'item__title', name));
    section.appendChild(imageProduct(image));
    section.appendChild(customElem('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCarItem);
  
    return section;
  }
  
  function getSku(item) {
    return item.querySelector('span.item__sku').innerText;
  }
  
  async function productList() {  
    loadingApi(); 
    const ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const response = await fetch(ENDPOINT);
    const data = await response.json();   
    const { results: [{ id, title, price, thumbnail }] } = data;     
    data.results.forEach((item) => {    
      const product = {
        sku: item.id,
        name: item.title,
        salePrice: item.price,
        image: item.thumbnail,
      };      
      createElement(product);      
    });   
    removeItem();
  }
  
  const savedLocalStorage = () => {
    if (localStorage.getItem('saveItensCar')) {
      const captureOls = document.querySelector('.cart__items');
      captureOls.innerHTML = localStorage.getItem('saveItensCar');
      const captureLis = document.querySelectorAll('.cart__item');
      captureLis.forEach((ele) => {
        ele.addEventListener('click', clickItem);
      });
    }  
  };
  
  const removeBtn = (() => {
    const getButton = document.querySelector('.empty-cart');
    getButton.addEventListener('click', () => {
        const getList = document.querySelectorAll('.cart__item');
        getList.forEach((item) => {               
          item.remove(item);
        });
        localStorage.saveItensCar = '';
        sumPrice();
       // console.log(getButton, getList);      
    });     
  });
  
  window.onload = function onload() { 
    productList();
    savedLocalStorage();
    removeBtn();   
  };