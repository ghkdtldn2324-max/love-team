const topButton = document.querySelector('.to-top');
topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

document.querySelectorAll('.service-card button').forEach(button => {
  button.addEventListener('click', () => {
    alert('장바구니/주문 기능은 다음 단계에서 연결합니다.');
  });
});
