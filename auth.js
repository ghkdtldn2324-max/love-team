(function () {
  if (document.getElementById('loveGlobalAuth')) return;

  const LOVE_TURNSTILE_SITE_KEY = '0x4AAAAAAFJkWkeTqUwHc2Ue';

  let supabase = null;

  try {
    if (
      window.supabase &&
      window.LOVE_TEAM_SUPABASE_URL &&
      window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY
    ) {
      supabase = window.supabase.createClient(
        window.LOVE_TEAM_SUPABASE_URL,
        window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY
      );

      window.LoveTeamSupabase = supabase;
    }
  } catch (error) {
    console.error('Supabase 초기화 실패:', error);
  }

  let turnstileReadyPromise = null;

  let loginTurnstileWidget = null;
  let signupTurnstileWidget = null;

  let loginCaptchaToken = '';
  let signupCaptchaToken = '';

  let currentSession = null;

  /* =========================================================
     CSS
  ========================================================= */

  const style = document.createElement('style');

  style.textContent = `
    .love-auth-overlay{
      position:fixed;
      inset:0;
      z-index:99999;
      display:none;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:rgba(0,0,0,.72);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
      box-sizing:border-box;
    }

    .love-auth-overlay.show{
      display:flex;
    }

    .love-auth-modal{
      width:100%;
      max-width:430px;
      max-height:calc(100vh - 40px);
      overflow-y:auto;
      background:#111;
      border:1px solid rgba(255,255,255,.12);
      border-radius:22px;
      box-shadow:0 25px 80px rgba(0,0,0,.55);
      color:#fff;
      padding:26px;
      box-sizing:border-box;
      position:relative;
    }

    .love-auth-close{
      position:absolute;
      top:13px;
      right:15px;
      width:34px;
      height:34px;
      border:0;
      border-radius:50%;
      background:rgba(255,255,255,.08);
      color:#fff;
      font-size:20px;
      line-height:34px;
      text-align:center;
      cursor:pointer;
      padding:0;
    }

    .love-auth-close:hover{
      background:rgba(255,255,255,.15);
    }

    .love-auth-title{
      margin:4px 0 7px;
      font-size:25px;
      font-weight:800;
      letter-spacing:-.5px;
    }

    .love-auth-subtitle{
      margin:0 0 20px;
      color:#999;
      font-size:13px;
      line-height:1.6;
    }

    .love-auth-tabs{
      display:flex;
      gap:6px;
      margin-bottom:20px;
      padding:4px;
      border-radius:12px;
      background:#080808;
    }

    .love-auth-tab{
      flex:1;
      height:42px;
      border:0;
      border-radius:9px;
      background:transparent;
      color:#888;
      font-size:14px;
      font-weight:700;
      cursor:pointer;
    }

    .love-auth-tab.active{
      background:#6d3df5;
      color:#fff;
    }

    .love-auth-panel[hidden]{
      display:none !important;
    }

    .love-auth-field{
      margin-bottom:13px;
    }

    .love-auth-label{
      display:block;
      margin-bottom:7px;
      color:#ddd;
      font-size:13px;
      font-weight:700;
    }

    .love-auth-input{
      width:100%;
      height:48px;
      border:1px solid rgba(255,255,255,.13);
      border-radius:11px;
      outline:none;
      background:#080808;
      color:#fff;
      padding:0 14px;
      box-sizing:border-box;
      font-size:14px;
    }

    .love-auth-input::placeholder{
      color:#555;
    }

    .love-auth-input:focus{
      border-color:#7c4dff;
      box-shadow:0 0 0 3px rgba(124,77,255,.13);
    }

    .love-auth-button{
      width:100%;
      height:49px;
      margin-top:4px;
      border:0;
      border-radius:11px;
      background:linear-gradient(135deg,#7c4dff,#5b32d6);
      color:#fff;
      font-size:15px;
      font-weight:800;
      cursor:pointer;
    }

    .love-auth-button:hover{
      filter:brightness(1.08);
    }

    .love-auth-button:disabled{
      opacity:.55;
      cursor:not-allowed;
    }

    .love-auth-message{
      min-height:20px;
      margin:11px 0 0;
      font-size:13px;
      line-height:1.5;
      text-align:center;
    }

    .love-auth-message.success{
      color:#73e6a1;
    }

    .love-auth-message.error{
      color:#ff7777;
    }

    .love-auth-switch{
      margin:16px 0 0;
      color:#777;
      font-size:12px;
      text-align:center;
      line-height:1.6;
    }

    .love-auth-switch button{
      border:0;
      padding:0;
      background:none;
      color:#a98cff;
      font-size:12px;
      font-weight:700;
      cursor:pointer;
    }

    .love-turnstile{
      width:100%;
      min-width:300px;
      min-height:65px;
      margin:2px 0 14px;
      display:flex;
      justify-content:center;
      align-items:flex-start;
      overflow:visible;
      box-sizing:border-box;
    }

    .love-member-menu{
      position:fixed;
      z-index:100000;
      top:76px;
      right:24px;
      width:245px;
      display:none;
      padding:16px;
      border:1px solid rgba(255,255,255,.12);
      border-radius:16px;
      background:#111;
      color:#fff;
      box-shadow:0 20px 60px rgba(0,0,0,.5);
      box-sizing:border-box;
    }

    .love-member-menu.show{
      display:block;
    }

    .love-member-name{
      margin:0;
      font-size:15px;
      font-weight:800;
    }

    .love-member-id{
      margin:4px 0 14px;
      color:#777;
      font-size:12px;
    }

    .love-member-menu button{
      width:100%;
      height:40px;
      margin-top:7px;
      border:1px solid rgba(255,255,255,.09);
      border-radius:9px;
      background:#191919;
      color:#fff;
      font-size:13px;
      font-weight:700;
      cursor:pointer;
    }

    .love-member-menu button:hover{
      background:#222;
    }

    .love-member-menu .love-logout-btn{
      color:#ff8585;
    }

    .love-password-overlay{
      position:fixed;
      inset:0;
      z-index:100001;
      display:none;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:rgba(0,0,0,.72);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
      box-sizing:border-box;
    }

    .love-password-overlay.show{
      display:flex;
    }

    .love-password-modal{
      width:100%;
      max-width:400px;
      background:#111;
      border:1px solid rgba(255,255,255,.12);
      border-radius:20px;
      padding:25px;
      box-sizing:border-box;
      color:#fff;
      box-shadow:0 25px 80px rgba(0,0,0,.55);
    }

    .love-password-modal h3{
      margin:0 0 8px;
      font-size:21px;
    }

    .love-password-modal p{
      margin:0 0 18px;
      color:#888;
      font-size:12px;
      line-height:1.6;
    }

    .love-password-actions{
      display:flex;
      gap:8px;
      margin-top:12px;
    }

    .love-password-actions button{
      flex:1;
      height:44px;
      border:0;
      border-radius:9px;
      cursor:pointer;
      font-weight:700;
    }

    .love-password-cancel{
      background:#222;
      color:#fff;
    }

    .love-password-submit{
      background:#6d3df5;
      color:#fff;
    }

    body.love-auth-lock{
      overflow:hidden;
    }

    .love-admin-link{
      display:none;
      align-items:center;
      justify-content:center;
      min-height:38px;
      padding:0 13px;
      border-radius:9px;
      border:1px solid rgba(145,108,255,.45);
      background:linear-gradient(135deg,#251548,#171020);
      color:#d8caff !important;
      text-decoration:none !important;
      font-size:13px;
      font-weight:800;
      white-space:nowrap;
    }

    .love-admin-link:hover{
      background:linear-gradient(135deg,#32205e,#20152d);
      border-color:#8d68ed;
    }

    @media(max-width:760px){
      .mobile-menu .love-admin-link{
        width:100%;
        min-height:48px;
        margin-top:4px;
        padding:0 14px;
        border-radius:10px;
        background:#24183f;
        border-color:#513b83;
        color:#d8caff !important;
        justify-content:center;
      }
    }

    @media(max-width:600px){

      .love-auth-overlay{
        padding:12px;
      }

      .love-auth-modal{
        max-width:none;
        max-height:calc(100vh - 24px);
        padding:22px 18px;
        border-radius:18px;
      }

      .love-auth-title{
        font-size:22px;
      }

      .love-turnstile{
        transform:scale(.88);
        transform-origin:center top;
        min-height:58px;
        margin-bottom:8px;
      }

      .love-member-menu{
        top:70px;
        right:12px;
        left:12px;
        width:auto;
      }

      .love-password-overlay{
        padding:12px;
      }
    }
  `;

  document.head.appendChild(style);


  /* =========================================================
     AUTH HTML
  ========================================================= */

  const wrapper = document.createElement('div');

  wrapper.id = 'loveGlobalAuth';

  wrapper.innerHTML = `
    <div
      class="love-auth-overlay"
      id="loveAuthOverlay"
      aria-hidden="true"
    >
      <div
        class="love-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="회원 로그인"
      >

        <button
          type="button"
          class="love-auth-close"
          id="loveAuthClose"
          aria-label="닫기"
        >×</button>

        <h2 class="love-auth-title">LOVE TEAM</h2>

        <p class="love-auth-subtitle">
          로그인 후 서비스를 이용해주세요.
        </p>

        <div class="love-auth-tabs">

          <button
            type="button"
            class="love-auth-tab active"
            data-mode="login"
          >
            로그인
          </button>

          <button
            type="button"
            class="love-auth-tab"
            data-mode="signup"
          >
            회원가입
          </button>

        </div>

        <!-- 로그인 -->

        <form
          class="love-auth-panel"
          data-panel="login"
          id="loveLoginForm"
        >

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveLoginId"
            >
              아이디
            </label>

            <input
              id="loveLoginId"
              class="love-auth-input"
              type="text"
              autocomplete="username"
              placeholder="아이디를 입력해주세요"
            >

          </div>

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveLoginPassword"
            >
              비밀번호
            </label>

            <input
              id="loveLoginPassword"
              class="love-auth-input"
              type="password"
              autocomplete="current-password"
              placeholder="비밀번호를 입력해주세요"
            >

          </div>

          <div
            class="love-turnstile"
            id="loveLoginTurnstile"
          ></div>

          <button
            class="love-auth-button"
            type="submit"
            id="loveLoginSubmit"
          >
            로그인
          </button>

          <div
            class="love-auth-message"
            id="loveLoginMessage"
            aria-live="polite"
          ></div>

          <p class="love-auth-switch">
            아직 회원이 아니신가요?
            <button
              type="button"
              data-switch-mode="signup"
            >
              회원가입
            </button>
          </p>

        </form>


        <!-- 회원가입 -->

        <form
          class="love-auth-panel"
          data-panel="signup"
          id="loveSignupForm"
          hidden
        >

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveSignupId"
            >
              아이디
            </label>

            <input
              id="loveSignupId"
              class="love-auth-input"
              type="text"
              autocomplete="username"
              placeholder="사용할 아이디를 입력해주세요"
            >

          </div>

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveSignupName"
            >
              이름
            </label>

            <input
              id="loveSignupName"
              class="love-auth-input"
              type="text"
              autocomplete="name"
              placeholder="이름을 입력해주세요"
            >

          </div>

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveSignupPassword"
            >
              비밀번호
            </label>

            <input
              id="loveSignupPassword"
              class="love-auth-input"
              type="password"
              autocomplete="new-password"
              placeholder="영문 + 숫자 + 특수문자 8자 이상"
            >

          </div>

          <div class="love-auth-field">

            <label
              class="love-auth-label"
              for="loveSignupPassword2"
            >
              비밀번호 확인
            </label>

            <input
              id="loveSignupPassword2"
              class="love-auth-input"
              type="password"
              autocomplete="new-password"
              placeholder="비밀번호를 다시 입력해주세요"
            >

          </div>

          <div
            class="love-turnstile"
            id="loveSignupTurnstile"
          ></div>

          <button
            class="love-auth-button"
            type="submit"
            id="loveSignupSubmit"
          >
            회원가입
          </button>

          <div
            class="love-auth-message"
            id="loveSignupMessage"
            aria-live="polite"
          ></div>

          <p class="love-auth-switch">
            이미 회원이신가요?
            <button
              type="button"
              data-switch-mode="login"
            >
              로그인
            </button>
          </p>

        </form>

      </div>
    </div>


    <!-- 회원 메뉴 -->

    <div
      class="love-member-menu"
      id="loveMemberMenu"
      aria-hidden="true"
    >

      <p
        class="love-member-name"
        id="loveMemberName"
      >
        회원
      </p>

      <p
        class="love-member-id"
        id="loveMemberId"
      >
        -
      </p>

      <button
        type="button"
        class="love-admin-menu-btn"
        id="loveAdminMenuButton"
        style="display:none;"
        onclick="window.location.href='admin.html'"
      >
        🛡️ 관리자 페이지
      </button>

      <button
        type="button"
        id="lovePasswordChange"
      >
        비밀번호 변경
      </button>

      <button
        type="button"
        class="love-logout-btn"
        data-love-logout
      >
        로그아웃
      </button>

    </div>


    <!-- 비밀번호 변경 -->

    <div
      class="love-password-overlay"
      id="lovePasswordOverlay"
      aria-hidden="true"
    >

      <div
        class="love-password-modal"
        role="dialog"
        aria-modal="true"
        aria-label="비밀번호 변경"
      >

        <h3>비밀번호 변경</h3>

        <p>
          새로운 비밀번호를 입력해주세요.<br>
          영문 + 숫자 + 특수문자를 포함한 8자 이상을 사용해주세요.
        </p>

        <div class="love-auth-field">

          <label
            class="love-auth-label"
            for="loveNewPassword"
          >
            새 비밀번호
          </label>

          <input
            id="loveNewPassword"
            class="love-auth-input"
            type="password"
            autocomplete="new-password"
            placeholder="새 비밀번호"
          >

        </div>

        <div class="love-auth-field">

          <label
            class="love-auth-label"
            for="loveNewPassword2"
          >
            새 비밀번호 확인
          </label>

          <input
            id="loveNewPassword2"
            class="love-auth-input"
            type="password"
            autocomplete="new-password"
            placeholder="새 비밀번호 확인"
          >

        </div>

        <div
          class="love-auth-message"
          id="lovePasswordMessage"
          aria-live="polite"
        ></div>

        <div class="love-password-actions">

          <button
            type="button"
            class="love-password-cancel"
            id="lovePasswordCancel"
          >
            취소
          </button>

          <button
            type="button"
            class="love-password-submit"
            id="lovePasswordSubmit"
          >
            변경하기
          </button>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(wrapper);


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const overlay =
    document.getElementById('loveAuthOverlay');

  const closeButton =
    document.getElementById('loveAuthClose');

  const tabs =
    document.querySelectorAll('.love-auth-tab');

  const panels =
    document.querySelectorAll('.love-auth-panel');

  const loginForm =
    document.getElementById('loveLoginForm');

  const signupForm =
    document.getElementById('loveSignupForm');

  const loginId =
    document.getElementById('loveLoginId');

  const loginPassword =
    document.getElementById('loveLoginPassword');

  const signupId =
    document.getElementById('loveSignupId');

  const signupName =
    document.getElementById('loveSignupName');

  const signupPassword =
    document.getElementById('loveSignupPassword');

  const signupPassword2 =
    document.getElementById('loveSignupPassword2');

  const loginMessage =
    document.getElementById('loveLoginMessage');

  const signupMessage =
    document.getElementById('loveSignupMessage');

  const passwordOverlay =
    document.getElementById('lovePasswordOverlay');

  const passwordChangeButton =
    document.getElementById('lovePasswordChange');

  const passwordCancelButton =
    document.getElementById('lovePasswordCancel');

  const passwordSubmitButton =
    document.getElementById('lovePasswordSubmit');

  const newPassword =
    document.getElementById('loveNewPassword');

  const newPassword2 =
    document.getElementById('loveNewPassword2');

  const passwordMessage =
    document.getElementById('lovePasswordMessage');

  const memberMenu =
    document.getElementById('loveMemberMenu');


  /* =========================================================
     BASIC HELPERS
  ========================================================= */

  function makeAuthEmail(id) {
    return String(id || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '') +
      '@love-team.local';
  }

  function clearMessages() {
    loginMessage.textContent = '';
    loginMessage.className = 'love-auth-message';

    signupMessage.textContent = '';
    signupMessage.className = 'love-auth-message';
  }

  function setMessage(element, text, type) {
    element.textContent = text || '';
    element.className =
      'love-auth-message' +
      (type ? ' ' + type : '');
  }

  function passwordIsStrong(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
      password
    );
  }



  function getFreshCaptchaToken(mode) {
    try {
      if (!window.turnstile) return '';

      const widgetId =
        mode === 'signup'
          ? signupTurnstileWidget
          : loginTurnstileWidget;

      if (widgetId === null || widgetId === undefined) {
        return '';
      }

      if (
        typeof window.turnstile.isExpired === 'function' &&
        window.turnstile.isExpired(widgetId)
      ) {
        if (mode === 'signup') {
          signupCaptchaToken = '';
        } else {
          loginCaptchaToken = '';
        }
        return '';
      }

      const liveToken =
        typeof window.turnstile.getResponse === 'function'
          ? window.turnstile.getResponse(widgetId)
          : '';

      const token =
        String(liveToken || '').trim();

      if (mode === 'signup') {
        signupCaptchaToken = token;
      } else {
        loginCaptchaToken = token;
      }

      return token;
    } catch (error) {
      console.warn(
        'Turnstile 토큰 확인 실패:',
        error
      );
      return '';
    }
  }

  /* =========================================================
     TURNSTILE LOAD
  ========================================================= */

  function loadTurnstile() {

    if (window.turnstile) {
      return Promise.resolve();
    }

    if (turnstileReadyPromise) {
      return turnstileReadyPromise;
    }

    turnstileReadyPromise = new Promise(function(resolve, reject) {

      const existing =
        document.querySelector(
          'script[data-love-turnstile]'
        );

      if (existing) {

        const check = function() {

          if (window.turnstile) {
            resolve();
            return;
          }

          setTimeout(check, 100);
        };

        check();
        return;
      }

      const script =
        document.createElement('script');

      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

      script.async = true;
      script.defer = true;

      script.dataset.loveTurnstile = '1';

      script.onload = function() {
        resolve();
      };

      script.onerror = function() {
        reject(
          new Error(
            'Turnstile 스크립트를 불러오지 못했습니다.'
          )
        );
      };

      document.head.appendChild(script);

    });

    return turnstileReadyPromise;
  }


  /* =========================================================
     TURNSTILE RENDER
     
     핵심 수정:
     - 현재 열려 있는 패널 하나만 렌더링
     - modal이 실제 화면에 배치된 뒤 렌더링
     - requestAnimationFrame 2번 대기
     - PC/모바일 레이아웃 계산 문제 방지
  ========================================================= */

  async function renderTurnstile(mode) {

    try {

      await loadTurnstile();

      if (!window.turnstile) {
        throw new Error(
          'Turnstile을 사용할 수 없습니다.'
        );
      }

      await new Promise(function(resolve) {

        requestAnimationFrame(function() {

          requestAnimationFrame(function() {

            resolve();

          });

        });

      });


      if (mode === 'signup') {

        loginCaptchaToken = '';

        if (loginTurnstileWidget !== null) {

          try {
            window.turnstile.reset(
              loginTurnstileWidget
            );
          } catch (error) {
            console.warn(
              '로그인 Turnstile reset 실패:',
              error
            );
          }
        }


        if (signupTurnstileWidget === null) {

          signupTurnstileWidget =
            window.turnstile.render(
              '#loveSignupTurnstile',
              {
                sitekey: LOVE_TURNSTILE_SITE_KEY,

                theme: 'light',

                size: 'flexible',

                appearance: 'always',

                callback: function(token) {
                  signupCaptchaToken = token;
                },

                'expired-callback': function() {
                  signupCaptchaToken = '';
                },

                'error-callback': function(errorCode) {

                  console.error(
                    'Signup Turnstile 오류:',
                    errorCode
                  );

                  signupCaptchaToken = '';
                },

                'timeout-callback': function() {
                  signupCaptchaToken = '';
                }
              }
            );

        } else {

          try {

            window.turnstile.reset(
              signupTurnstileWidget
            );

            signupCaptchaToken = '';

          } catch (error) {

            console.warn(
              '회원가입 Turnstile reset 실패:',
              error
            );

          }

        }

      } else {

        signupCaptchaToken = '';

        if (signupTurnstileWidget !== null) {

          try {
            window.turnstile.reset(
              signupTurnstileWidget
            );
          } catch (error) {
            console.warn(
              '회원가입 Turnstile reset 실패:',
              error
            );
          }

        }


        if (loginTurnstileWidget === null) {

          loginTurnstileWidget =
            window.turnstile.render(
              '#loveLoginTurnstile',
              {
                sitekey: LOVE_TURNSTILE_SITE_KEY,

                theme: 'light',

                size: 'flexible',

                appearance: 'always',

                callback: function(token) {
                  loginCaptchaToken = token;
                },

                'expired-callback': function() {
                  loginCaptchaToken = '';
                },

                'error-callback': function(errorCode) {

                  console.error(
                    'Login Turnstile 오류:',
                    errorCode
                  );

                  loginCaptchaToken = '';
                },

                'timeout-callback': function() {
                  loginCaptchaToken = '';
                }
              }
            );

        } else {

          try {

            window.turnstile.reset(
              loginTurnstileWidget
            );

            loginCaptchaToken = '';

          } catch (error) {

            console.warn(
              '로그인 Turnstile reset 실패:',
              error
            );

          }

        }

      }

    } catch (error) {

      console.error(
        'Turnstile 렌더링 실패:',
        error
      );

      const target =
        mode === 'signup'
          ? signupMessage
          : loginMessage;

      setMessage(
        target,
        '보안 인증을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        'error'
      );

    }

  }


  /* =========================================================
     AUTH MODAL SHOW / HIDE
  ========================================================= */

  function show(mode) {

    /*
      헤더에서 어떤 버튼을 눌렀든
      기본은 로그인 화면.

      단,
      모달 내부 탭을 누를 때는
      show('signup') 등이 그대로 작동한다.
    */

    mode =
      mode === 'signup'
        ? 'signup'
        : 'login';


    overlay.classList.add('show');

    overlay.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.classList.add(
      'love-auth-lock'
    );


    tabs.forEach(function(tab) {

      tab.classList.toggle(
        'active',
        tab.dataset.mode === mode
      );

    });


    panels.forEach(function(panel) {

      panel.hidden =
        panel.dataset.panel !== mode;

    });


    clearMessages();


    /*
      PC에서 modal layout이 잡힌 뒤
      Turnstile을 렌더링하기 위해
      renderTurnstile 내부에서
      requestAnimationFrame을 두 번 사용한다.
    */

    renderTurnstile(mode);


    setTimeout(function() {

      if (mode === 'signup') {

        signupId.focus();

      } else {

        loginId.focus();

      }

    }, 50);

  }


  function hide() {

    overlay.classList.remove('show');

    overlay.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'love-auth-lock'
    );

    clearMessages();

  }


  /* =========================================================
     TAB SWITCH
  ========================================================= */

  tabs.forEach(function(tab) {

    tab.addEventListener(
      'click',
      function() {

        const mode =
          tab.dataset.mode;

        if (!mode) return;

        clearMessages();

        show(mode);

      }
    );

  });


  document.addEventListener(
    'click',
    function(event) {

      const button =
        event.target.closest(
          '[data-switch-mode]'
        );

      if (!button) return;

      const mode =
        button.dataset.switchMode;

      if (!mode) return;

      clearMessages();

      show(mode);

    }
  );


  /* =========================================================
     CLOSE
  ========================================================= */

  closeButton.addEventListener(
    'click',
    hide
  );


  overlay.addEventListener(
    'click',
    function(event) {

      if (event.target === overlay) {
        hide();
      }

    }
  );


  document.addEventListener(
    'keydown',
    function(event) {

      if (
        event.key === 'Escape' &&
        overlay.classList.contains('show')
      ) {
        hide();
      }

    }
  );


  /* =========================================================
     OPENERS
     
     핵심 수정:
     헤더의 "로그인 / 회원가입"을 눌러도
     무조건 로그인 화면부터 열림.
  ========================================================= */

  function bindOpeners() {

    const selectors = [
      'a[href="login.html"]',
      'a[href="signup.html"]',
      'a[href="#login"]',
      'a[href="#signup"]',
      'a[data-auth-open]',
      'a[href="#auth"]'
    ];

    document
      .querySelectorAll(selectors.join(','))
      .forEach(function(a) {

        if (a.dataset.loveAuthBound) {
          return;
        }

        a.dataset.loveAuthBound = '1';

        a.addEventListener(
          'click',
          function(event) {

            event.preventDefault();

            /*
              중요:
              회원가입 버튼을 눌러도
              바로 회원가입 화면으로 가지 않고
              항상 로그인 화면부터 보여준다.
            */

            show('login');

          }
        );

      });


    /*
      혹시 다른 페이지의 헤더가
      .header-actions / .actions 구조를 사용하는 경우도 처리.
    */

    document
      .querySelectorAll(
        '.header-actions a, .actions a'
      )
      .forEach(function(a) {

        if (a.dataset.loveAuthBound) {
          return;
        }

        const text =
          (a.textContent || '').trim();

        const href =
          a.getAttribute('href') || '';

        const isAuthButton =
          (
            text.includes('로그인') ||
            text.includes('회원가입')
          ) &&
          !text.includes('고객센터') &&
          !text.includes('장바구니') &&
          href !== 'https://open.kakao.com/';

        if (!isAuthButton) {
          return;
        }

        a.dataset.loveAuthBound = '1';

        a.addEventListener(
          'click',
          function(event) {

            event.preventDefault();

            show('login');

          }
        );

      });

  }


  bindOpeners();


  /* =========================================================
     LOGIN
  ========================================================= */

  loginForm.addEventListener(
    'submit',
    async function(event) {

      event.preventDefault();

      clearMessages();


      if (!supabase) {

        setMessage(
          loginMessage,
          '로그인 시스템을 불러오지 못했습니다.',
          'error'
        );

        return;
      }


      const id =
        loginId.value.trim();

      const password =
        loginPassword.value;


      if (!id) {

        setMessage(
          loginMessage,
          '아이디를 입력해주세요.',
          'error'
        );

        loginId.focus();

        return;
      }


      if (!password) {

        setMessage(
          loginMessage,
          '비밀번호를 입력해주세요.',
          'error'
        );

        loginPassword.focus();

        return;
      }


      const freshLoginCaptchaToken =
        getFreshCaptchaToken('login');

      if (!freshLoginCaptchaToken) {

        setMessage(
          loginMessage,
          '보안 인증을 완료해주세요. 체크 표시가 된 뒤 다시 시도해주세요.',
          'error'
        );

        return;
      }


      const submitButton =
        document.getElementById(
          'loveLoginSubmit'
        );

      submitButton.disabled = true;


      try {

        const authEmail =
          makeAuthEmail(id);


        const result =
          await supabase.auth.signInWithPassword({

            email: authEmail,

            password: password,

            options: {
              captchaToken: freshLoginCaptchaToken
            }

          });


        /*
          Turnstile 토큰은
          한 번 사용하면 다시 사용할 수 없으므로
          성공/실패와 관계없이 초기화한다.
        */

        loginCaptchaToken = '';

        if (
          window.turnstile &&
          loginTurnstileWidget !== null
        ) {

          try {
            window.turnstile.reset(
              loginTurnstileWidget
            );
          } catch (error) {
            console.warn(
              '로그인 Turnstile reset 실패:',
              error
            );
          }

        }


        if (result.error) {

          console.error('로그인 오류:', {
            message: result.error.message,
            code: result.error.code,
            status: result.error.status,
            name: result.error.name,
            fullError: result.error
          });


          let message =
            result.error.message ||
            '로그인에 실패했습니다.';


          if (
            /captcha/i.test(message) ||
            /turnstile/i.test(message)
          ) {

            message =
              '보안 인증에 실패했습니다. 다시 인증해주세요.';

          } else if (
            /invalid login credentials/i.test(message)
          ) {

            message =
              '아이디 또는 비밀번호가 올바르지 않습니다.';

          }


          setMessage(
            loginMessage,
            message,
            'error'
          );

          return;
        }


        currentSession =
          result.data.session || null;

        window.LoveTeamSession =
          currentSession;


        setMessage(
          loginMessage,
          '로그인되었습니다.',
          'success'
        );
        updateLoveHeader(currentSession);
        closeMemberMenu();
        hide();
        window.dispatchEvent(new Event('love-auth-changed'));

      } catch (error) {

        console.error(
          '로그인 처리 오류:',
          error
        );

        loginCaptchaToken = '';

        if (
          window.turnstile &&
          loginTurnstileWidget !== null
        ) {

          try {
            window.turnstile.reset(
              loginTurnstileWidget
            );
          } catch (resetError) {
            console.warn(
              'Turnstile reset 오류:',
              resetError
            );
          }

        }


        setMessage(
          loginMessage,
          '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error'
        );

      } finally {

        submitButton.disabled = false;

      }

    }
  );


  /* =========================================================
     SIGNUP
  ========================================================= */

  signupForm.addEventListener(
    'submit',
    async function(event) {

      event.preventDefault();

      clearMessages();


      if (!supabase) {

        setMessage(
          signupMessage,
          '회원가입 시스템을 불러오지 못했습니다.',
          'error'
        );

        return;
      }


      const id =
        signupId.value.trim();

      const name =
        signupName.value.trim();

      const password =
        signupPassword.value;

      const passwordConfirm =
        signupPassword2.value;


      if (!id) {

        setMessage(
          signupMessage,
          '아이디를 입력해주세요.',
          'error'
        );

        signupId.focus();

        return;
      }


      if (id.length < 3) {

        setMessage(
          signupMessage,
          '아이디는 3자 이상 입력해주세요.',
          'error'
        );

        signupId.focus();

        return;
      }


      if (!name) {

        setMessage(
          signupMessage,
          '이름을 입력해주세요.',
          'error'
        );

        signupName.focus();

        return;
      }


      if (!passwordIsStrong(password)) {

        setMessage(
          signupMessage,
          '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.',
          'error'
        );

        signupPassword.focus();

        return;
      }


      if (password !== passwordConfirm) {

        setMessage(
          signupMessage,
          '비밀번호가 서로 일치하지 않습니다.',
          'error'
        );

        signupPassword2.focus();

        return;
      }


      const freshSignupCaptchaToken =
        getFreshCaptchaToken('signup');

      if (!freshSignupCaptchaToken) {

        setMessage(
          signupMessage,
          '보안 인증을 완료해주세요. 체크 표시가 된 뒤 다시 시도해주세요.',
          'error'
        );

        return;
      }


      const submitButton =
        document.getElementById(
          'loveSignupSubmit'
        );

      submitButton.disabled = true;


      try {

        const authEmail =
          makeAuthEmail(id);


        const result =
          await supabase.auth.signUp({

            email: authEmail,

            password: password,

            options: {

              captchaToken:
                freshSignupCaptchaToken,

              data: {
                username: id,
                name: name
              }

            }

          });


        signupCaptchaToken = '';


        if (
          window.turnstile &&
          signupTurnstileWidget !== null
        ) {

          try {
            window.turnstile.reset(
              signupTurnstileWidget
            );
          } catch (error) {
            console.warn(
              '회원가입 Turnstile reset 실패:',
              error
            );
          }

        }


        if (result.error) {

          console.error('회원가입 오류:', {
            message: result.error.message,
            code: result.error.code,
            status: result.error.status,
            name: result.error.name,
            fullError: result.error
          });


          let message =
            result.error.message ||
            '회원가입에 실패했습니다.';


          if (
            /captcha/i.test(message) ||
            /turnstile/i.test(message)
          ) {

            message =
              '보안 인증에 실패했습니다. 다시 인증해주세요.';

          } else if (
            /already registered/i.test(message) ||
            /already been registered/i.test(message)
          ) {

            message =
              '이미 사용 중인 아이디입니다.';

          }


          setMessage(
            signupMessage,
            message,
            'error'
          );

          return;
        }


        setMessage(
          signupMessage,
          '회원가입이 완료되었습니다. 로그인해주세요.',
          'success'
        );


        /*
          회원가입 완료 후
          로그인 화면으로 이동.
        */

        setTimeout(
          function() {

            show('login');

            loginId.value = id;

            loginPassword.value = '';

          },
          900
        );

      } catch (error) {

        console.error(
          '회원가입 처리 오류:',
          error
        );

        signupCaptchaToken = '';

        if (
          window.turnstile &&
          signupTurnstileWidget !== null
        ) {

          try {
            window.turnstile.reset(
              signupTurnstileWidget
            );
          } catch (resetError) {
            console.warn(
              'Turnstile reset 오류:',
              resetError
            );
          }

        }


        setMessage(
          signupMessage,
          '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error'
        );

      } finally {

        submitButton.disabled = false;

      }

    }
  );


  /* =========================================================
     HEADER LOGIN STATE
  ========================================================= */

  function getDisplayName(user) {

    if (!user) return '회원';

    const metadata =
      user.user_metadata || {};

    return (
      metadata.name ||
      metadata.username ||
      user.email ||
      '회원'
    );

  }


  function getDisplayId(user) {

    if (!user) return '';

    const metadata =
      user.user_metadata || {};

    return (
      metadata.username ||
      ''
    );

  }


  async function updateAdminAccessUI(session, retryCount = 0) {

    const desktopLinks = [];

    document.querySelectorAll('.header-actions').forEach(function(container){
      let link = container.querySelector('.love-admin-link');

      if(!link){
        link = document.createElement('a');
        link.className = 'love-admin-link';
        link.href = 'admin.html';
        link.textContent = '관리자 페이지';
        link.setAttribute('aria-label','관리자 페이지');
        container.insertBefore(
          link,
          container.querySelector('.kakao-btn') || null
        );
      }

      desktopLinks.push(link);
    });

    const memberAdminButton =
      document.getElementById('loveAdminMenuButton');

    desktopLinks.forEach(function(link){
      link.style.display = 'none';
    });

    if(memberAdminButton){
      memberAdminButton.style.display = 'none';
    }

    if(!session?.user || !supabase){
      return;
    }

    try{
      /*
        모바일에서는 로그인 직후 세션이 저장되는 순간과
        Edge Function 인증 토큰이 준비되는 순간이 약간 다를 수 있다.
        따라서 관리자 확인이 실패하면 잠시 후 최대 3회 재확인한다.
      */
      const result =
        await supabase.functions.invoke('admin-check',{body:{}});

      const isAdmin =
        !result.error &&
        result.data?.ok === true &&
        result.data?.admin === true;

      if(!isAdmin){
        if(retryCount < 3){
          setTimeout(function(){
            supabase.auth.getSession().then(function(fresh){
              const freshSession =
                fresh?.data?.session || null;

              if(freshSession?.user){
                updateAdminAccessUI(freshSession, retryCount + 1);
              }
            });
          }, 350);

        } else if(result.error){
          console.error('관리자 UI 확인 실패:', result.error);
        }

        return;
      }

      desktopLinks.forEach(function(link){
        link.style.display = 'flex';
      });

      /*
        모바일 관리자 페이지는 별도 메뉴가 아니라
        기존 점선 회원 메뉴 내부에만 표시한다.
      */
      if(memberAdminButton){
        memberAdminButton.style.display = 'flex';
        memberAdminButton.style.visibility = 'visible';
      }

    }catch(error){
      console.error('관리자 UI 확인 실패:', error);

      if(retryCount < 3){
        setTimeout(function(){
          supabase.auth.getSession().then(function(fresh){
            const freshSession =
              fresh?.data?.session || null;

            if(freshSession?.user){
              updateAdminAccessUI(freshSession, retryCount + 1);
            }
          });
        }, 350);
      }
    }
  }


  function updateLoveHeader(session) {

    currentSession =
      session || null;

    window.LoveTeamSession =
      currentSession;


    const authLinks =
      document.querySelectorAll(
        '.header-actions a, .actions a, #mobileOpenAuth'
      );


    authLinks.forEach(function(a) {

      const text =
        (a.textContent || '').trim();

      const href =
        a.getAttribute('href') || '';

      const isAuthLink =
        a.dataset.loveAuthStatus === '1' ||
        a.hasAttribute('data-auth-open') ||
        href === '#member' ||
        href === '#login' ||
        text.includes('로그인') ||
        text.includes('회원가입') ||
        text.endsWith('님');

      if (!isAuthLink) {
        return;
      }


      if (text.includes('고객센터')) {
        return;
      }


      a.dataset.loveAuthStatus = '1';


      if (session && session.user) {

        a.textContent =
          getDisplayName(session.user) +
          '님';

        a.href = '#member';

      } else {

        a.textContent =
          '로그인 / 회원가입';

        a.href = '#login';

      }

    });


    updateMemberMenu(session);
    updateAdminAccessUI(session);

  }


  function updateMemberMenu(session) {

    const nameElement =
      document.getElementById(
        'loveMemberName'
      );

    const idElement =
      document.getElementById(
        'loveMemberId'
      );


    if (!session || !session.user) {

      nameElement.textContent =
        '회원';

      idElement.textContent =
        '';

      return;
    }


    nameElement.textContent =
      getDisplayName(session.user) +
      '님';

    idElement.textContent =
      getDisplayId(session.user)
        ? '@' + getDisplayId(session.user)
        : '';

  }


  /* =========================================================
     MEMBER MENU
  ========================================================= */

  function openMemberMenu() {

    if (
      !currentSession ||
      !currentSession.user
    ) {
      show('login');
      return;
    }


    updateMemberMenu(
      currentSession
    );


    memberMenu.classList.add(
      'show'
    );

    memberMenu.setAttribute(
      'aria-hidden',
      'false'
    );

  }


  function closeMemberMenu() {

    memberMenu.classList.remove(
      'show'
    );

    memberMenu.setAttribute(
      'aria-hidden',
      'true'
    );

  }


  document.addEventListener(
    'click',
    function(event) {
      const authLink = event.target.closest(
        '#mobileOpenAuth, .header-actions a, .actions a'
      );

      if (authLink) {
        const text = (authLink.textContent || '').trim();
        const href = authLink.getAttribute('href') || '';

        const isAuthLink =
          authLink.id === 'mobileOpenAuth' ||
          authLink.hasAttribute('data-auth-open') ||
          text.includes('로그인') ||
          text.includes('회원가입') ||
          text.includes('님') ||
          href === '#member' ||
          href === '#login';

        if (isAuthLink && !text.includes('고객센터')) {
          event.preventDefault();
          event.stopImmediatePropagation();

          const mobileMenu = document.getElementById('mobileMenu');
          const mobileMenuBtn = document.getElementById('mobileMenuBtn');

          if (mobileMenu) {
            mobileMenu.classList.remove('active');
          }

          if (mobileMenuBtn) {
            mobileMenuBtn.textContent = '☰';
            mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
          }

          if (currentSession && currentSession.user) {
            openMemberMenu();
          } else {
            show('login');
          }

          return;
        }
      }

      if (
        memberMenu.classList.contains('show') &&
        !event.target.closest('#loveMemberMenu') &&
        !event.target.closest(
          '#mobileOpenAuth, .header-actions a, .actions a'
        )
      ) {
        closeMemberMenu();
      }
    },
    true
  );


  /* =========================================================
     PASSWORD CHANGE
  ========================================================= */

  function openPasswordModal() {

    closeMemberMenu();

    passwordOverlay.classList.add(
      'show'
    );

    passwordOverlay.setAttribute(
      'aria-hidden',
      'false'
    );

    newPassword.value = '';
    newPassword2.value = '';

    passwordMessage.textContent = '';
    passwordMessage.className =
      'love-auth-message';

    setTimeout(
      function() {
        newPassword.focus();
      },
      50
    );

  }


  function closePasswordModal() {

    passwordOverlay.classList.remove(
      'show'
    );

    passwordOverlay.setAttribute(
      'aria-hidden',
      'true'
    );

    newPassword.value = '';
    newPassword2.value = '';

    passwordMessage.textContent = '';
    passwordMessage.className =
      'love-auth-message';

  }


  passwordChangeButton.addEventListener(
    'click',
    openPasswordModal
  );


  passwordCancelButton.addEventListener(
    'click',
    closePasswordModal
  );


  passwordOverlay.addEventListener(
    'click',
    function(event) {

      if (
        event.target === passwordOverlay
      ) {
        closePasswordModal();
      }

    }
  );


  passwordSubmitButton.addEventListener(
    'click',
    async function() {

      passwordMessage.textContent = '';
      passwordMessage.className =
        'love-auth-message';


      if (!supabase) {

        setMessage(
          passwordMessage,
          '로그인 시스템을 불러오지 못했습니다.',
          'error'
        );

        return;
      }


      if (
        !currentSession ||
        !currentSession.user
      ) {

        closePasswordModal();

        show('login');

        return;
      }


      const password =
        newPassword.value;

      const passwordConfirm =
        newPassword2.value;


      if (!passwordIsStrong(password)) {

        setMessage(
          passwordMessage,
          '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.',
          'error'
        );

        newPassword.focus();

        return;
      }


      if (password !== passwordConfirm) {

        setMessage(
          passwordMessage,
          '비밀번호가 서로 일치하지 않습니다.',
          'error'
        );

        newPassword2.focus();

        return;
      }


      passwordSubmitButton.disabled =
        true;


      try {

        const result =
          await supabase.auth.updateUser({
            password: password
          });


        if (result.error) {

          console.error(
            '비밀번호 변경 오류:',
            result.error
          );

          setMessage(
            passwordMessage,
            '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
            'error'
          );

          return;
        }


        setMessage(
          passwordMessage,
          '비밀번호가 변경되었습니다.',
          'success'
        );


        setTimeout(
          closePasswordModal,
          900
        );

      } catch (error) {

        console.error(
          '비밀번호 변경 처리 오류:',
          error
        );

        setMessage(
          passwordMessage,
          '비밀번호 변경 중 오류가 발생했습니다.',
          'error'
        );

      } finally {

        passwordSubmitButton.disabled =
          false;

      }

    }
  );


  /* =========================================================
     LOGOUT
  ========================================================= */

  document.addEventListener(
    'click',
    async function(event) {

      const logoutButton =
        event.target.closest(
          '[data-love-logout]'
        );

      if (!logoutButton) {
        return;
      }


      event.preventDefault();


      if (!supabase) {
        return;
      }


      try {

        const result =
          await supabase.auth.signOut();


        if (result.error) {

          console.error(
            '로그아웃 오류:',
            result.error
          );

          return;
        }


        currentSession = null;

        window.LoveTeamSession =
          null;

        /* 로그아웃 성공 즉시 PC/모바일 헤더를 비로그인 상태로 갱신 */
        updateLoveHeader(null);

        closeMemberMenu();

        window.dispatchEvent(
          new Event('love-auth-changed')
        );

      } catch (error) {

        console.error(
          '로그아웃 처리 오류:',
          error
        );

      }

    }
  );


  /* =========================================================
     AUTH STATE CHANGE
  ========================================================= */

  if (supabase) {

    supabase.auth.onAuthStateChange(
      function(event, session) {

        currentSession =
          session || null;

        window.LoveTeamSession =
          currentSession;


        updateLoveHeader(
          currentSession
        );


        window.dispatchEvent(
          new CustomEvent(
            'love-auth-state',
            {
              detail: {
                event: event,
                session: session
              }
            }
          )
        );

      }
    );


    supabase.auth.getSession()
      .then(function(result) {

        currentSession =
          result.data.session || null;

        window.LoveTeamSession =
          currentSession;

        updateLoveHeader(
          currentSession
        );
        updateAdminAccessUI(currentSession);

      })
      .catch(function(error) {

        console.error(
          '세션 확인 실패:',
          error
        );

      });

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.LoveTeamAuth = {

    open: show,

    close: hide,

    client: supabase,

    getSession: async function() {
      if (!supabase) return null;
      const result = await supabase.auth.getSession();
      const session = result?.data?.session || null;
      currentSession = session;
      window.LoveTeamSession = session;
      return session;
    }

  };


  /*
    다른 페이지에서 로그인 상태 변경 후
    헤더를 다시 갱신할 수 있도록 지원.
  */

  window.addEventListener(
    'love-auth-changed',
    function() {

      if (!supabase) return;


      supabase.auth.getSession()
        .then(function(result) {

          currentSession =
            result.data.session || null;

          window.LoveTeamSession =
            currentSession;

          updateLoveHeader(
            currentSession
          );

        });

    }
  );

})();
