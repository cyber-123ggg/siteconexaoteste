import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAywK-WTOrn0Xw0MV5Jr9zr1ZKUvSBcCW0",
  authDomain: "appmuffatao.firebaseapp.com",
  projectId: "appmuffatao",
  storageBucket: "appmuffatao.firebasestorage.app",
  messagingSenderId: "504077340677",
  appId: "1:504077340677:web:ac39802ad01a88cc9b8c6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productGrid = document.getElementById('product-grid');
const categoriesContainer = document.getElementById('categories-container');

let todosProdutos = [];
let categoriaAtiva = 'Todos';

function formatPrice(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Renderiza a barra de botões com base nas categorias existentes no banco
function renderizarBotoesCategorias() {
  // Coleta categorias únicas dos produtos cadastrados (ignorando vazias/nulas)
  const categoriasExistentes = Array.from(
    new Set(todosProdutos.map(p => p.categoria).filter(Boolean))
  );

  // Verifica se existe algum produto com promocao === true
  const temPromocao = todosProdutos.some(p => p.promocao === true);

  categoriesContainer.innerHTML = '';

  // Botão "Todos"
  const btnTodos = document.createElement('button');
  btnTodos.className = `category-btn ${categoriaAtiva === 'Todos' ? 'active' : ''}`;
  btnTodos.textContent = 'Todos';
  btnTodos.onclick = () => selecionarCategoria('Todos');
  categoriesContainer.appendChild(btnTodos);

  // Botão "Promoções 🔥" (Aparece se houver ao menos um produto em oferta ou selecionado)
  if (temPromocao || categoriaAtiva === 'Promocao') {
    const btnPromo = document.createElement('button');
    btnPromo.className = `category-btn promo-btn ${categoriaAtiva === 'Promocao' ? 'active' : ''}`;
    btnPromo.textContent = 'Promoções 🔥';
    btnPromo.onclick = () => selecionarCategoria('Promocao');
    categoriesContainer.appendChild(btnPromo);
  }

  // Cria um botão para cada categoria que POSSUI produtos
  categoriasExistentes.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${categoriaAtiva === cat ? 'active' : ''}`;
    btn.textContent = cat;
    btn.onclick = () => selecionarCategoria(cat);
    categoriesContainer.appendChild(btn);
  });
}

function selecionarCategoria(categoria) {
  categoriaAtiva = categoria;
  renderizarBotoesCategorias();
  renderizarProdutos();
}

// Renderiza a lista de produtos na tela
function renderizarProdutos() {
  productGrid.innerHTML = '';

  let produtosFiltrados = [];

  if (categoriaAtiva === 'Todos') {
    produtosFiltrados = todosProdutos;
  } else if (categoriaAtiva === 'Promocao') {
    produtosFiltrados = todosProdutos.filter(p => p.promocao === true);
  } else {
    produtosFiltrados = todosProdutos.filter(p => p.categoria === categoriaAtiva);
  }

  if (produtosFiltrados.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px 0;">Nenhum produto encontrado nesta categoria.</p>`;
    return;
  }

  produtosFiltrados.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const seloPromo = product.promocao 
      ? `<span class="promo-badge">OFERTA</span>` 
      : '';

    card.innerHTML = `
      ${seloPromo}
      <div class="image-container">
        <img src="${product.imagem || 'https://via.placeholder.com/200?text=Sem+Foto'}" alt="${product.nome}">
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoria || 'Geral'}</span>
        <h2 class="product-title">${product.nome}</h2>
        <span class="product-barcode">Cód: ${product.codigo || 'N/A'}</span>
        <span class="product-price">${formatPrice(product.preco)}</span>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// Busca dados em tempo real no Firestore
const productsRef = collection(db, 'produtos');
const q = query(productsRef, orderBy('nome', 'asc'));

onSnapshot(q, (snapshot) => {
  todosProdutos = [];
  snapshot.forEach((doc) => {
    todosProdutos.push(doc.data());
  });

  renderizarBotoesCategorias();
  renderizarProdutos();
});
