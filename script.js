const topButton = document.querySelector('.to-top');
topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

document.querySelectorAll('.service-card button').forEach(button => {
  button.addEventListener('click', () => {
    alert('장바구니/주문 기능은 다음 단계에서 연결합니다.');
  });
});

document.querySelectorAll(".price-tab").forEach(t=>t.addEventListener("click",()=>{const k=t.dataset.priceTab;document.querySelectorAll(".price-tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".price-panel").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelector(`[data-price-panel="${k}"]`)?.classList.add("active")}));
document.querySelectorAll("[data-kakao]").forEach(x=>x.addEventListener("click",e=>{e.preventDefault();alert("카카오톡 오픈채팅 링크를 연결하면 바로 상담할 수 있습니다.")}));
