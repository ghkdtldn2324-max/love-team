(function () {
  'use strict';

  /* =========================
     가격표 데이터
  ========================= */

  const pricing = {
    win: {
      title: '승당제 강의',
      copy: '기본 1티어 승급을 목표로 하시는 분께 추천드립니다. 현재 티어에 맞춰 안정적으로 승급을 진행합니다.',
      items: [
        ['아이언', '5,000원'],
        ['브론즈', '5,000원'],
        ['실버', '6,000원'],
        ['골드', '7,000원'],
        ['플래티넘', '9,000원'],
        ['다이아 1', '12,000원'],
        ['다이아 2', '13,000원'],
        ['다이아 3', '14,000원'],
        ['초월자 1', '17,000원'],
        ['초월자 2', '19,000원'],
        ['초월자 3', '21,000원'],
        ['불멸 1', '32,000원'],
        ['불멸 2', '37,000원'],
        ['불멸 3', '42,000원'],
        ['래디언트', '가격문의']
      ]
    },

    duo: {
      title: '듀오 서비스',
      copy: '원하시는 게임 방향에 맞춰 함께 플레이하며 안정적으로 승급을 진행합니다.',
      items: [
        ['아이언', '5,000원'],
        ['브론즈', '5,000원'],
        ['실버', '6,000원'],
        ['골드', '7,000원'],
        ['플래티넘', '9,000원'],
        ['다이아', '13,000원'],
        ['초월자 1', '17,000원'],
        ['초월자 2', '18,000원'],
        ['초월자 3', '20,000원'],
        ['불멸 1', '30,000원'],
        ['불멸 2', '35,000원'],
        ['불멸 3', '35,000원'],
        ['래디언트', '가격문의']
      ]
    },

    tier: {
      title: '티어 승급',
      copy: '현재 티어에서 목표 티어까지 구간별로 승급을 진행합니다.',
      items: [
        ['아이언', '16,000원'],
        ['브론즈', '18,000원'],
        ['실버', '19,000원'],
        ['골드', '23,000원'],
        ['플래티넘', '35,000원'],
        ['다이아 1', '46,000원'],
        ['다이아 2', '50,000원'],
        ['다이아 3', '53,000원'],
        ['초월자 1', '65,000원'],
        ['초월자 2', '75,000원'],
        ['초월자 3', '83,000원'],
        ['불멸 1', '150,000원'],
        ['불멸 2', '140,000원'],
        ['불멸 3', '190,000원'],
        ['래디언트', '가격문의']
      ]
    },

    placement: {
      title: '배치고사',
      copy: '배치고사 진행을 원하는 분들을 위한 서비스입니다. 판당 기준으로 안내합니다.',
      items: [
        ['아이언', '판당 11,000원'],
        ['브론즈', '판당 11,000원'],
        ['실버', '판당 11,000원'],
        ['골드', '판당 11,000원'],
        ['플래티넘', '판당 11,000원'],
        ['다이아', '판당 14,000원'],
        ['초월자', '판당 17,000원'],
        ['불멸', '판당 19,000원'],
        ['래디언트', '판당 25,000원']
      ]
    }
  };


  /* =========================
     랭크 PNG
  ========================= */

  const rankIcon = {
    '아이언': './assets/ranks/iron1.png',
    '브론즈': './assets/ranks/bronze1.png',
    '실버': './assets/ranks/silver1.png',
    '골드': './assets/ranks/gold1.png',
    '플래티넘': './assets/ranks/platinum1.png',

    '다이아 1': './assets/ranks/diamond1.png',
    '다이아 2': './assets/ranks/diamond2.png',
    '다이아 3': './assets/ranks/diamond3.png',
    '다이아': './assets/ranks/diamond1.png',

    '초월자 1': './assets/ranks/ascendant1.png',
    '초월자 2': './assets/ranks/ascendant2.png',
    '초월자 3': './assets/ranks/ascendant3.png',
    '초월자': './assets/ranks/ascendant1.png',

    '불멸 1': './assets/ranks/immortal1.png',
    '불멸 2': './assets/ranks/immortal2.png',
    '불멸 3': './assets/ranks/immortal3.png',
    '불멸': './assets/ranks/immortal1.png',

    '래디언트': './assets/ranks/radiant.png'
  };


  /* =========================
     가격표 렌더링
  ========================= */

  function renderPricing(key) {

    const grid = document.getElementById('pricing-grid');
    const title = document.getElementById('info-title');
    const copy = document.getElementById('info-copy');

    if (!grid) {
      return;
    }

    const info = pricing[key];

    if (!info) {
      return;
    }

    if (title) {
      title.textContent = info.title;
    }

    if (copy) {
      copy.textContent = info.copy;
    }


    /* grid 자체가 CSS 때문에 숨겨지는 경우 강제 표시 */
    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';
    grid.style.height = 'auto';
    grid.style.minHeight = '100px';


    grid.innerHTML = info.items.map(function (item) {

      const name = item[0];
      const price = item[1];
      const icon = rankIcon[name] || '';

      return `
        <article
          class="rank-card"
          style="
            display:flex !important;
            visibility:visible !important;
            opacity:1 !important;
            position:relative !important;
            width:auto !important;
            min-height:190px !important;
            box-sizing:border-box !important;
          "
        >

          <div
            class="rank-icon"
            style="
              display:flex !important;
              visibility:visible !important;
              opacity:1 !important;
              width:78px !important;
              height:78px !important;
              min-width:78px !important;
              min-height:78px !important;
              margin:0 auto 12px !important;
              align-items:center !important;
              justify-content:center !important;
              overflow:visible !important;
            "
          >
            ${
              icon
                ? `
                  <img
                    src="${icon}"
                    alt="${name}"
                    loading="eager"
                    style="
                      display:block !important;
                      visibility:visible !important;
                      opacity:1 !important;
                      width:68px !important;
                      height:68px !important;
                      max-width:none !important;
                      max-height:none !important;
                      object-fit:contain !important;
                    "
                  >
                `
                : ''
            }
          </div>

          <div
            class="rank-name"
            style="
              display:block !important;
              visibility:visible !important;
              opacity:1 !important;
            "
          >
            ${name}
          </div>

          <div
            class="rank-price"
            style="
              display:block !important;
              visibility:visible !important;
              opacity:1 !important;
            "
          >
            ${price}
          </div>

        </article>
      `;

    }).join('');


    /* 이미지 로딩 실패 확인용 */
    grid.querySelectorAll('img').forEach(function (img) {

      img.addEventListener('error', function () {

        console.error(
          '랭크 이미지 로딩 실패:',
          img.src
        );

        img.style.display = 'none';

      });

    });

  }


  /* =========================
     1:1 강의
  ========================= */

  function renderLesson() {

    const grid = document.getElementById('pricing-grid');
    const title = document.getElementById('info-title');
    const copy = document.getElementById('info-copy');

    if (!grid) {
      return;
    }

    if (title) {
      title.textContent = '1:1 강의';
    }

    if (copy) {
      copy.textContent =
        '개인별 플레이 분석과 코칭을 원하는 분들을 위한 1:1 강의입니다.';
    }

    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';

    grid.innerHTML = `
      <div
        class="lesson-grid"
        style="
          grid-column:1/-1 !important;
          display:grid !important;
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          gap:20px !important;
          width:100% !important;
        "
      >

        <a
          class="lesson-card"
          href="https://open.kakao.com/"
          target="_blank"
          rel="noopener"
          style="
            display:block !important;
            visibility:visible !important;
            opacity:1 !important;
          "
        >
          <span class="eyebrow">1:1 COACHING</span>
          <h3>1시간 강의</h3>
          <strong>24,000원</strong>
          <span class="lesson-link">
            카카오톡 오픈채팅 상담 →
          </span>
        </a>

        <a
          class="lesson-card"
          href="https://open.kakao.com/"
          target="_blank"
          rel="noopener"
          style="
            display:block !important;
            visibility:visible !important;
            opacity:1 !important;
          "
        >
          <span class="eyebrow">1:1 COACHING</span>
          <h3>3시간 강의</h3>
          <strong>69,000원</strong>
          <span class="lesson-link">
            카카오톡 오픈채팅 상담 →
          </span>
        </a>

      </div>
    `;
  }


  /* =========================
     페이지 시작
  ========================= */

  document.addEventListener('DOMContentLoaded', function () {


    /* 가격표 탭 */

    document.querySelectorAll('.pricing-tab').forEach(function (button) {

      button.addEventListener('click', function () {

        document.querySelectorAll('.pricing-tab').forEach(function (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const key = this.dataset.tab;

        if (key === 'lesson') {
          renderLesson();
        } else {
          renderPricing(key);
        }

      });

    });


    /* 첫 화면 */

    if (document.getElementById('pricing-grid')) {
      renderPricing('win');
    }


    /* =========================
       모바일 메뉴
    ========================= */

    const menuBtn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (menuBtn && menu) {

      menuBtn.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        menu.classList.toggle('active');

        const open = menu.classList.contains('active');

        menuBtn.textContent = open ? '✕' : '☰';

        menuBtn.setAttribute(
          'aria-label',
          open ? '메뉴 닫기' : '메뉴 열기'
        );

      });


      menu.querySelectorAll('a').forEach(function (link) {

        link.addEventListener('click', function () {

          if (link.id !== 'mobileOpenAuth') {

            menu.classList.remove('active');
            menuBtn.textContent = '☰';

            menuBtn.setAttribute(
              'aria-label',
              '메뉴 열기'
            );

          }

        });

      });


      const mobileAuth =
        document.getElementById('mobileOpenAuth');

      if (mobileAuth) {

        mobileAuth.addEventListener('click', function (e) {

          e.preventDefault();

          menu.classList.remove('active');
          menuBtn.textContent = '☰';

          const authButton =
            document.querySelector('#openAuth,[data-auth-open]');

          if (authButton) {
            authButton.click();
          }

        });

      }

    }


    /* =========================
       FAQ
    ========================= */

    document.querySelectorAll('.question').forEach(function (button) {

      button.addEventListener('click', function () {

        const answer =
          document.getElementById(this.dataset.target);

        if (!answer) {
          return;
        }

        const willOpen =
          !answer.classList.contains('open');

        document
          .querySelectorAll('.answer.open')
          .forEach(function (item) {
            item.classList.remove('open');
          });

        document
          .querySelectorAll('.question.is-open')
          .forEach(function (item) {
            item.classList.remove('is-open');
          });

        if (willOpen) {

          answer.classList.add('open');
          this.classList.add('is-open');

        }

      });

    });


    /* =========================
       맨 위로 버튼
    ========================= */

    const topButton =
      document.querySelector('.to-top');

    if (topButton) {

      window.addEventListener('scroll', function () {

        topButton.style.display =
          window.scrollY > 500 ? 'grid' : 'none';

      });

      topButton.addEventListener('click', function () {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      });

    }


    /* =========================
       홈 작업 내역
    ========================= */

    const homeWorkList =
      document.getElementById('homeWorkList');

    if (homeWorkList) {

      const fallback = [
        {
          name: 'Gh***',
          detail: '승당 3판 진행 중',
          status: 'progress'
        },
        {
          name: 'Ab***',
          detail: '플레티넘 → 다이아몬드',
          status: 'done'
        },
        {
          name: 'Lo***',
          detail: '듀오 5판 진행 중',
          status: 'progress'
        }
      ];

      let data = fallback;

      try {

        data =
          JSON.parse(
            localStorage.getItem('loveTeamWorks')
          ) || fallback;

      } catch (e) {

        data = fallback;

      }

      homeWorkList.innerHTML =
        data.slice(0, 3).map(function (x) {

          return `
            <div class="work-status-row">

              <div class="work-left">
                <span class="work-user">
                  ${x.name} 님
                </span>

                <span class="work-detail">
                  ${x.detail}
                </span>
              </div>

              <span class="work-status ${
                x.status === 'done'
                  ? 'done'
                  : 'progress'
              }">
                ${
                  x.status === 'done'
                    ? '완료'
                    : '진행 중'
                }
              </span>

            </div>
          `;

        }).join('');

    }

  });


  /* =========================
     현재 페이지 메뉴 표시
  ========================= */

  (function () {

    const current =
      (
        location.pathname
          .split('/')
          .pop() || 'index.html'
      ).toLowerCase();

    document.querySelectorAll('.nav a').forEach(function (a) {

      const href =
        (
          a.getAttribute('href') || ''
        )
          .split('#')[0]
          .toLowerCase();

      if (href === current) {

        a.classList.add('active');

        a.setAttribute(
          'aria-current',
          'page'
        );

      }

    });

  })();

})();
