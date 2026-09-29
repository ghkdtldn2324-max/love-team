const pricingData = {
  win: {
    title: '승당제 강의',
    copy: '기본 1티어 승급을 목표로 하시는 분께 추천드립니다. 현재 티어에 맞춰 안정적으로 승급을 진행합니다.',
    items: [
      ['iron',1,'IRON','아이언','5,000원'],['bronze',1,'BRONZE','브론즈','5,000원'],['silver',1,'SILVER','실버','6,000원'],
      ['gold',1,'GOLD','골드','7,000원'],['platinum',1,'PLATINUM','플래티넘','9,000원'],
      ['diamond',1,'DIAMOND 1','다이아 1','12,000원'],['diamond',2,'DIAMOND 2','다이아 2','13,000원'],['diamond',3,'DIAMOND 3','다이아 3','14,000원'],
      ['ascendant',1,'ASCENDANT 1','초월자 1','17,000원'],['ascendant',2,'ASCENDANT 2','초월자 2','19,000원'],['ascendant',3,'ASCENDANT 3','초월자 3','21,000원'],
      ['immortal',1,'IMMORTAL 1','불멸 1','32,000원'],['immortal',2,'IMMORTAL 2','불멸 2','37,000원'],['immortal',3,'IMMORTAL 3','불멸 3','42,000원'],
      ['radiant',0,'RADIANT','래디언트','가격문의']
    ]
  },
  duo: {
    title: '듀오제 강의',
    copy: '레디언트 이상 기사님들과 함께 듀오로 진행합니다. 팀운과 트롤에 지쳤다면 로브팀과 함께 새로운 게임 경험을 만나보세요.',
    items: [
      ['iron',1,'IRON','아이언','5,000원'],['bronze',1,'BRONZE','브론즈','5,000원'],['silver',1,'SILVER','실버','6,000원'],
      ['gold',1,'GOLD','골드','7,000원'],['platinum',1,'PLATINUM','플래티넘','9,000원'],
      ['diamond',3,'DIAMOND','다이아','13,000원'],
      ['ascendant',1,'ASCENDANT 1','초월자 1','17,000원'],['ascendant',2,'ASCENDANT 2','초월자 2','18,000원'],['ascendant',3,'ASCENDANT 3','초월자 3','20,000원'],
      ['immortal',1,'IMMORTAL 1','불멸 1','30,000원'],['immortal',2,'IMMORTAL 2','불멸 2','35,000원'],['immortal',3,'IMMORTAL 3','불멸 3','35,000원'],
      ['radiant',0,'RADIANT','래디언트','가격문의']
    ]
  },
  tier: {
    title: '티어제 강의',
    copy: '기본 2티어 승급을 목표로 하시는 분께 추천드립니다. 목표 구간까지 단계적으로 진행합니다.',
    items: [
      ['iron',1,'IRON','아이언','16,000원'],['bronze',1,'BRONZE','브론즈','18,000원'],['silver',1,'SILVER','실버','19,000원'],
      ['gold',1,'GOLD','골드','23,000원'],['platinum',1,'PLATINUM','플래티넘','35,000원'],
      ['diamond',1,'DIAMOND 1','다이아 1','46,000원'],['diamond',2,'DIAMOND 2','다이아 2','50,000원'],['diamond',3,'DIAMOND 3','다이아 3','53,000원'],
      ['ascendant',1,'ASCENDANT 1','초월자 1','65,000원'],['ascendant',2,'ASCENDANT 2','초월자 2','75,000원'],['ascendant',3,'ASCENDANT 3','초월자 3','83,000원'],
      ['immortal',1,'IMMORTAL 1','불멸 1','150,000원'],['immortal',2,'IMMORTAL 2','불멸 2','140,000원'],['immortal',3,'IMMORTAL 3','불멸 3','190,000원'],
      ['radiant',0,'RADIANT','래디언트','가격문의']
    ]
  },
  placement: {
    title: '배치고사',
    copy: '누구에게나 소중한 경쟁전의 시작. 배치고사를 로브팀 기사님들이 꼼꼼하게 진행합니다.',
    items: [
      ['iron',1,'IRON','아이언','11,000원','판당'],['bronze',1,'BRONZE','브론즈','11,000원','판당'],['silver',1,'SILVER','실버','11,000원','판당'],
      ['gold',1,'GOLD','골드','11,000원','판당'],['platinum',1,'PLATINUM','플래티넘','11,000원','판당'],
      ['diamond',3,'DIAMOND','다이아','14,000원','판당'],['ascendant',3,'ASCENDANT','초월자','17,000원','판당'],
      ['immortal',3,'IMMORTAL','불멸','19,000원','판당'],['radiant',0,'RADIANT','래디언트','25,000원','판당']
    ]
  },
  lesson: {
    title: '1:1 강의',
    copy: '전문 코치 기사님의 개인 코칭과 피드백, 기본기·심화 운영·포지션 강의, 모든 QnA까지 맞춤형으로 진행합니다.',
    items: [
      ['radiant',0,'1 HOUR','1시간','24,000원'],
      ['radiant',0,'3 HOURS','3시간','69,000원']
    ]
  }
};

const grid = document.getElementById('pricing-grid');

function rankImage(type, tier) {
  if (type === 'radiant') return 'assets/ranks/radiant.png';
  const safeTier = tier || 3;
  return `assets/ranks/${type}${safeTier}.png`;
}

function emblem(type, tier) {
  const safeTier = tier || 3;
  return `<div class="rank-art ${type} tier-${safeTier}">
    <img src="${rankImage(type, tier)}" alt="" loading="lazy">
  </div>`;
}

function renderPricing(key) {
  if (!grid) return;
  const d = pricingData[key];
  const title = document.getElementById('info-title');
  const copy = document.getElementById('info-copy');
  if (title) title.textContent = d.title;
  if (copy) copy.textContent = d.copy;

  grid.className = 'rank-grid' + (key === 'lesson' ? ' lesson-grid' : '');

  grid.innerHTML = d.items.map(item => {
    const [type, tier, en, ko, price, note] = item;

    if (key === 'lesson') {
      return `<article class="rank-card lesson-card">
        ${emblem('radiant',0)}
        <div class="lesson-time">${en}</div>
        <div class="lesson-desc">${ko} 맞춤 코칭</div>
        <div class="lesson-price">${price}</div>
        <button class="lesson-btn" type="button" data-lesson="${ko}">상담하기</button>
      </article>`;
    }

    return `<article class="rank-card">
      ${emblem(type,tier)}
      <div class="rank-name-ko">${ko}</div>
      <div class="rank-price ${price === '가격문의' ? 'inquiry' : ''}">${price}</div>
      ${note ? `<div class="rank-note">${note}</div>` : ''}
    </article>`;
  }).join('');
}

document.querySelectorAll('.pricing-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pricing-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected','false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    renderPricing(btn.dataset.tab);
  });
});

document.addEventListener('click', e => {
  if (e.target.matches('.lesson-btn')) {
    window.open('https://open.kakao.com/', '_blank', 'noopener');
  }
});

const toTop = document.querySelector('.to-top');
if (toTop) toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

renderPricing('win');
