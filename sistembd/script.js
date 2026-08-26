import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAywK-WTOrn0Xw0MV5Jr9zr1ZKUvSBcCW0",
  authDomain: "appmuffatao.firebaseapp.com",
  projectId: "appmuffatao",
  storageBucket: "appmuffatao.firebasestorage.app",
  messagingSenderId: "504077340677",
  appId: "1:504077340677:web:ac39802ad01a88cc9b8c6c"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productGrid = document.getElementById('product-grid');

// Função para formatar números como moeda (R$)
function formatPrice(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Escuta a coleção em tempo real e insere os cards ordenados por nome
const productsRef = collection(db, 'produtos'); // Certifique-se de que o nome da coleção está correto
const q = query(productsRef, orderBy('nome', 'asc'));

onSnapshot(q, (snapshot) => {
  productGrid.innerHTML = ''; // Limpa o grid antes de atualizar

  snapshot.forEach((doc) => {
    const product = doc.data();

    // Cria o elemento do card
    const card = document.createElement('div');
    card.className = 'product-card';

    // Monta o HTML utilizando os campos exatos da sua foto
    card.innerHTML = `
      <div class="image-container">
        <img src="${product.imagem || 'https://via.placeholder.com/200?text=Sem+Foto'}" alt="${product.nome}">
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.nome}</h2>
        <span class="product-barcode">Cód: ${product.codigo || 'N/A'}</span>
        <span class="product-price">${formatPrice(product.preco)}</span>
      </div>
    `;

    productGrid.appendChild(card);
  });
});