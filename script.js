const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal= document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const cartAcai = document.getElementById("cart-acai")
const acaibtn = document.getElementById("acai-btn")
const closeModalAcai = document.getElementById("close-modal-btn-acai")
const sorveteBtn = document.getElementById("sorvete-btn")
const cartSorvete = document.getElementById("cart-sorvete")


// Array vazio
let cart =[];


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
}) 

// Clica para fechar o Moda (Area de venda)
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})



// Click no carrinho do produto
menu.addEventListener("click", function(event){
    
    let parenButton = event.target.closest(".add-to-cart-btn")

    if(parenButton){
        const name = parenButton.getAttribute("data-name")
        const price = parseFloat(parenButton.getAttribute("data-price"))
        addToCart(name, price)
        // Adicionar no carrinho
    }

})


// Função para adicionar no carrinho
function addToCart(name, price, extras = [], obs = "") {
    const existingItem = cart.find(item => 
        item.name === name && 
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        item.obs === obs
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
            extras,
            obs
        });
    }

    updateCartModal();
}


// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpa a lista do carrinho
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col", "bg-gray-100", "p-3", "rounded");

        // Monta os adicionais
        let extrasHTML = "";
        if (item.extras && item.extras.length > 0) {
            extrasHTML = `<div class="ml-2 mt-1 text-sm text-gray-700">
                ${item.extras.map(extra => `<p>+ ${extra}</p>`).join("")}
            </div>`;
        }

        // Monta a observação
        let obsHTML = "";
        if (item.obs && item.obs.trim() !== "") {
            obsHTML = `<p class="ml-2 mt-2 text-xs italic text-gray-600">Obs: ${item.obs}</p>`;
        }

        // Adiciona o nome do item, adicionais, observação, quantidade e preço
        cartItemElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <p class="font-semibold">${item.name}</p> <!-- Nome do item -->
                    ${extrasHTML} <!-- Exibe os adicionais -->
                    ${obsHTML} <!-- Exibe a observação -->
                    <p class="mt-2 font-medium">Qtd: ${item.quantity}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn text-red-500 text-sm font-semibold mt-1" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Atualiza o total do carrinho
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}




// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

function removeItemCart(name){
    function removeItemCart(name) {
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            const item = cart[index];
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartModal();
        }
    }
}

    
// Verificar o endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
// Remover a borda vermelhar quando começar a digitar
    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})


// Caso não tenha nenhum produto = Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "O restaurante esta fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
// Caso não tenha digitado o endereço
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

// Enviar o pedido para api whats
const cartItems = cart.map((item) =>{
    return(
        `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    )
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "981107774" 

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

cart = [];
updateCartModal();

})

// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 13 && hora < 23; // true = restaurante esta aberto
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}


// Abrir o modal do Açai
acaibtn.addEventListener("click", function() {
    updateCartModal();
    cartAcai.style.display = "flex"
})

// Fechar o modal Acai quando clicar fora
cartAcai.addEventListener("click", function(event){
    if(event.target === cartAcai) {
        cartAcai.style.display = "none"
    }
}) 

// Clica para fechar o Modal Acai (Area de venda)
closeModalAcai.addEventListener("click", function(){
    cartAcai.style.display = "none"
})

const closeModalSorvete = document.getElementById("close-modal-btn-sorvete")

// Abrir o modal do Sorvete
sorveteBtn.addEventListener("click", function() {
    updateCartModal();
    cartSorvete.style.display = "flex"
})

// Clica para fechar o Modal Sorvete (Area de venda)
closeModalSorvete.addEventListener("click", function(){
    cartSorvete.style.display = "none"
})

// Fechar o modal Sorvete quando clicar fora
cartSorvete.addEventListener("click", function(event){
    if(event.target === cartSorvete) {
        cartSorvete.style.display = "none"
    }
})

function updateCartTotalPicolé() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-price]');
    let total = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const price = parseFloat(checkbox.getAttribute("data-price"));
            total += price;
        }
    });

    const totalElement = document.getElementById("cart-total-picole");
    totalElement.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza o total sempre que qualquer checkbox com data-price mudar
const priceCheckboxes = document.querySelectorAll('input[type="checkbox"][data-price]');
priceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateCartTotalPicolé);
});



  function atualizarTotalAcai() {
    let total = 0;
    const checkboxes = document.querySelectorAll('#cart-acai input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        total += parseFloat(checkbox.getAttribute('data-price'));
      }
    });

    document.getElementById('cart-total-acai').innerText = total.toFixed(2);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('#cart-acai input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', atualizarTotalAcai);
    });

    atualizarTotalAcai(); // Garante que o total comece certo
  });



 document.getElementById("add-cart-btn-acai").addEventListener("click", function () {
    const checkedSizes = document.querySelectorAll(
        "#cart-acai input[type='checkbox']:checked[data-name^='Açai']"
    );
    const checkedAdditionals = document.querySelectorAll(
        "#cart-acai input[type='checkbox']:checked:not([data-name^='Açai'])"
    );

    if (checkedSizes.length !== 1) {
        alert("Selecione apenas um tamanho de açaí.");
        return;
    }

    const size = checkedSizes[0].getAttribute("data-name");
    const sizePrice = parseFloat(checkedSizes[0].getAttribute("data-price"));

    let additionals = [];
    let additionalsPrice = 0;

    checkedAdditionals.forEach((el) => {
        const name = el.getAttribute("data-name");
        const price = parseFloat(el.getAttribute("data-price"));
        additionals.push(name);
        additionalsPrice += price;
    });

    const observation = document.getElementById("observation").value;
    const finalPrice = sizePrice + additionalsPrice;

    // Adiciona ao carrinho principal
    addToCart(size, finalPrice, additionals, observation);

    // Limpa seleção
    document.querySelectorAll("#cart-acai input[type='checkbox']").forEach((el) => {
        el.checked = false;
    });
    document.getElementById("observation").value = "";

    // Atualiza carrinho principal
    updateCartModal();

    // Fecha o modal do Açaí
    cartAcai.style.display = "none";


});

