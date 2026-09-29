(function(){
  if(document.getElementById('loveGlobalAuth')) return;

  const css=`
  .love-auth-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.72);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
    opacity:0;
    visibility:hidden;
    pointer-events:none;
    transition:opacity .22s ease,visibility .22s ease;
    z-index:99999;
    font-family:Arial,"Noto Sans KR",sans-serif;
  }

  .love-auth-overlay.show{
    opacity:1;
    visibility:visible;
    pointer-events:auto;
  }

  .love-auth-modal{
    width:min(450px,100%);
    max-height:92vh;
    overflow:auto;
    background:#fff;
    color:#222;
    border-radius:18px;
    box-shadow:0 30px 90px rgba(0,0,0,.45);
    padding:28px;
    position:relative;
    transform:translateY(18px) scale(.98);
    transition:transform .24s ease;
    box-sizing:border-box;
  }

  .love-auth-overlay.show .love-auth-modal{
    transform:translateY(0) scale(1);
  }

  .love-auth-close{
    position:absolute;
    right:10px;
    top:7px;
    border:0;
    background:transparent;
    color:#777;
    font-size:28px;
    cursor:pointer;
    line-height:1;
    padding:5px 9px;
  }

  .love-auth-tabs{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:4px;
    background:#f3f1f8;
    border-radius:10px;
    padding:4px;
    margin-bottom:23px;
  }

  .love-auth-tab{
    border:0;
    background:transparent;
    color:#777;
    border-radius:8px;
    padding:10px 4px;
    font-size:12px;
    font-weight:800;
    cursor:pointer;
  }

  .love-auth-tab.active{
    background:linear-gradient(100deg,#4e8fff,#a64de9);
    color:#fff;
    box-shadow:0 5px 14px rgba(105,86,226,.2);
  }

  .love-auth-kicker{
    font-size:10px;
    letter-spacing:2px;
    color:#8b56df;
    font-weight:800;
    margin:0 0 6px;
  }

  .love-auth-panel h2{
    margin:0 0 18px;
    font-size:27px;
    color:#222;
  }

  .love-auth-panel label{
    display:block;
    font-size:12px;
    font-weight:700;
    color:#444;
    margin:0 0 13px;
  }

  .love-auth-panel input{
    width:100%;
    margin-top:7px;
    padding:12px 13px;
    border:1px solid #ddd9e8;
    border-radius:9px;
    outline:none;
    font:inherit;
    color:#222;
    background:#fff;
    box-sizing:border-box;
  }

  .love-auth-panel input:focus{
    border-color:#8662ed;
    box-shadow:0 0 0 3px rgba(134,98,237,.1);
  }

  .love-auth-help{
    font-size:11px;
    color:#777;
    margin:-2px 0 14px;
    line-height:1.5;
  }

  .love-auth-submit{
    width:100%;
    border:0;
    border-radius:9px;
    padding:13px;
    background:linear-gradient(100deg,#4e8fff,#a64de9);
    color:#fff;
    font-weight:800;
    cursor:pointer;
  }

  .love-auth-submit:disabled{
    opacity:.6;
    cursor:wait;
  }

  .love-auth-links{
    display:flex;
    justify-content:center;
    gap:15px;
    margin-top:13px;
    font-size:11px;
    color:#777;
  }

  .love-auth-message{
    display:none;
    margin:0 0 14px;
    padding:10px 12px;
    border-radius:8px;
    background:#f5f1ff;
    color:#6d4ee8;
    font-size:11px;
    line-height:1.5;
  }

  .love-auth-message.error{
    background:#fff0f1;
    color:#c33;
  }

  @media(max-width:600px){
    .love-auth-overlay{
      padding:12px;
    }

    .love-auth-modal{
      width:calc(100vw - 34px);
      max-width:340px;
      max-height:calc(100vh - 80px);
      padding:30px 18px 20px;
      border-radius:16px;
    }

    .love-auth-close{
      right:7px;
      top:5px;
      width:32px;
      height:32px;
      padding:0;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:23px;
    }

    .love-auth-tabs{
      margin-bottom:18px;
    }

    .love-auth-tab{
      padding:8px 3px;
      font-size:11px;
    }

    .love-auth-panel h2{
      font-size:23px;
      margin-bottom:15px;
    }

    .love-auth-panel label{
      font-size:11px;
      margin-bottom:10px;
    }

    .love-auth-panel input{
      height:40px;
      padding:9px 11px;
      font-size:13px;
    }

    .love-auth-help{
      font-size:10px;
    }

    .love-auth-submit{
      min-height:40px;
      padding:10px;
      font-size:13px;
    }
  }
  `;

  const style=document.createElement('style');
  style.id='loveGlobalAuthStyle';
  style.textContent=css;
  document.head.appendChild(style);

  const wrap=document.createElement('div');
  wrap.id='loveGlobalAuth';

  wrap.innerHTML=`
  <div class="love-auth-overlay" id="loveAuthOverlay" aria-hidden="true">

    <div class="love-auth-modal"
         role="dialog"
         aria-modal="true"
         aria-labelledby="loveAuthTitle">

      <button class="love-auth-close"
              type="button"
              aria-label="닫기">×</button>

      <div class="love-auth-tabs">

        <button class="love-auth-tab active"
                type="button"
                data-mode="login">
          로그인
        </button>

        <button class="love-auth-tab"
                type="button"
                data-mode="signup">
          회원가입
        </button>

      </div>


      <!-- 로그인 -->

      <div class="love-auth-panel" data-panel="login">

        <p class="love-auth-kicker">
          LOVE TEAM MEMBER
        </p>

        <h2 id="loveAuthTitle">
          로그인
        </h2>

        <label>
          ID
          <input
            type="text"
            id="loveLoginId"
            placeholder="ID를 입력해주세요"
            autocomplete="username">
        </label>

        <label>
          비밀번호
          <input
            type="password"
            id="loveLoginPassword"
            placeholder="비밀번호를 입력해주세요"
            autocomplete="current-password">
        </label>

        <p class="love-auth-message"
           id="loveLoginMessage"></p>

        <button
          class="love-auth-submit"
          type="button"
          data-submit="login">
          로그인
        </button>

      </div>


      <!-- 회원가입 -->

      <div class="love-auth-panel"
           data-panel="signup"
           hidden>

        <p class="love-auth-kicker">
          LOVE TEAM MEMBER
        </p>

        <h2>
          회원가입
        </h2>

        <label>
          ID
          <input
            type="text"
            id="loveSignupId"
            placeholder="사용할 ID를 입력해주세요"
            autocomplete="username"
            maxlength="20">
        </label>

        <label>
          비밀번호
          <input
            type="password"
            id="loveSignupPassword"
            placeholder="비밀번호를 입력해주세요"
            autocomplete="new-password">
        </label>

        <label>
          비밀번호 재확인
          <input
            type="password"
            id="loveSignupPassword2"
            placeholder="비밀번호를 다시 입력해주세요"
            autocomplete="new-password">
        </label>

        <label>
          이름
          <input
            type="text"
            id="loveSignupName"
            placeholder="이름을 입력해주세요"
            autocomplete="name"
            maxlength="20">
        </label>

        <p class="love-auth-help">
          비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
        </p>

        <p class="love-auth-message"
           id="loveSignupMessage"></p>

        <button
          class="love-auth-submit"
          type="button"
          data-submit="signup">
          회원가입
        </button>

      </div>

    </div>
  </div>`;

  document.body.appendChild(wrap);

  const overlay=document.getElementById('loveAuthOverlay');

  const panels=[
    ...document.querySelectorAll(
      '#loveGlobalAuth .love-auth-panel'
    )
  ];

  const tabs=[
    ...document.querySelectorAll(
      '#loveGlobalAuth .love-auth-tab'
    )
  ];

  let supabase=null;

  try{

    if(
      window.supabase &&
      window.LOVE_TEAM_SUPABASE_URL &&
      window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY
    ){

      supabase=
        window.supabase.createClient(
          window.LOVE_TEAM_SUPABASE_URL,
          window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY
        );

      window.LoveTeamSupabase=supabase;

    }

  }catch(e){

    console.error(e);

  }


  function show(mode){

    overlay.classList.add('show');

    overlay.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.classList.add(
      'love-auth-lock'
    );

    tabs.forEach(t=>{
      t.classList.toggle(
        'active',
        t.dataset.mode===mode
      );
    });

    panels.forEach(p=>{
      p.hidden=p.dataset.panel!==mode;
    });

  }


  function hide(){

    overlay.classList.remove('show');

    overlay.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'love-auth-lock'
    );

  }


  function msg(id,text,error=false){

    const m=document.getElementById(id);

    if(!m)return;

    m.style.display='block';

    m.textContent=text;

    m.classList.toggle(
      'error',
      error
    );

  }


  function clearMessages(){

    document
      .querySelectorAll(
        '#loveGlobalAuth .love-auth-message'
      )
      .forEach(m=>{

        m.style.display='none';

        m.textContent='';

        m.classList.remove('error');

      });

  }


  function busy(btn,on){

    if(!btn)return;

    btn.disabled=on;

    btn.dataset.oldText=
      btn.dataset.oldText ||
      btn.textContent;

    btn.textContent=
      on ? '처리 중...' :
      btn.dataset.oldText;

  }


  /*
    Supabase 내부에서는 ID를 이메일 형식으로 변환해서 사용합니다.

    사용자에게는 이메일을 요구하지 않습니다.
    실제 입력값:
    example123

    Supabase 내부:
    example123@love-team.local
  */

  function makeAuthEmail(id){

    return (
      id
        .trim()
        .toLowerCase()
        .replace(/\s+/g,'')
    ) + '@love-team.local';

  }


  function validId(id){

    return /^[A-Za-z0-9_-]{4,20}$/.test(id);

  }


  function bindOpeners(){

    document
      .querySelectorAll(
        'a[href="login.html"],' +
        'a[href="signup.html"],' +
        'a[href="#login"],' +
        'a[href="#signup"],' +
        'a[data-auth-open],' +
        'a[href="#auth"]'
      )
      .forEach(a=>{

        if(a.dataset.loveAuthBound)return;

        a.dataset.loveAuthBound='1';

        a.addEventListener(
          'click',
          e=>{

            e.preventDefault();

            const text=
              (a.textContent||'').trim();

            show(
              /회원가입/.test(text) ||
              a.getAttribute('href')==='#signup'
                ? 'signup'
                : 'login'
            );

          }
        );

      });


    document
      .querySelectorAll(
        '.header-actions a, .actions a'
      )
      .forEach(a=>{

        const text=
          (a.textContent||'')
            .replace(/\s/g,'');

        if(
          /로그인.*회원가입|로그인|회원가입/.test(text) &&
          !/장바구니|고객센터/.test(text) &&
          !a.dataset.loveAuthBound
        ){

          a.dataset.loveAuthBound='1';

          a.addEventListener(
            'click',
            e=>{

              e.preventDefault();

              show(
                text.includes('회원가입') &&
                !text.includes('로그인')
                  ? 'signup'
                  : 'login'
              );

            }
          );

        }

      });

  }


  bindOpeners();


  document
    .getElementById('loveGlobalAuth')
    .addEventListener(
      'click',
      async e=>{

        const t=
          e.target.closest(
            '[data-mode],[data-submit]'
          );

        if(!t)return;


        if(t.dataset.mode){

          clearMessages();

          show(t.dataset.mode);

          return;

        }


        const btn=t;

        const action=
          btn.dataset.submit;

        busy(btn,true);


        try{

          if(!supabase){

            throw new Error(
              'Supabase 연결 정보를 불러오지 못했습니다.'
            );

          }


          /* =========================
             회원가입
          ========================= */

          if(action==='signup'){

            const id=
              document
                .getElementById('loveSignupId')
                .value
                .trim();

            const name=
              document
                .getElementById('loveSignupName')
                .value
                .trim();

            const pw=
              document
                .getElementById('loveSignupPassword')
                .value;

            const pw2=
              document
                .getElementById('loveSignupPassword2')
                .value;


            if(!id){

              return msg(
                'loveSignupMessage',
                'ID를 입력해주세요.',
                true
              );

            }


            if(!validId(id)){

              return msg(
                'loveSignupMessage',
                'ID는 영문, 숫자, 밑줄(_) 또는 하이픈(-) 4~20자로 입력해주세요.',
                true
              );

            }


            if(!name){

              return msg(
                'loveSignupMessage',
                '이름을 입력해주세요.',
                true
              );

            }


            if(
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
                .test(pw)
            ){

              return msg(
                'loveSignupMessage',
                '비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
                true
              );

            }


            if(pw!==pw2){

              return msg(
                'loveSignupMessage',
                '비밀번호 재확인이 일치하지 않습니다.',
                true
              );

            }


            const authEmail=
              makeAuthEmail(id);


            const {data,error}=
              await supabase.auth.signUp({

                email:authEmail,

                password:pw,

                options:{
                  data:{
                    username:id,
                    name:name
                  }
                }

              });


            if(error)throw error;


            if(data.user){

              msg(
                'loveSignupMessage',
                '회원가입이 완료되었습니다. ID와 비밀번호로 로그인해주세요.'
              );

              setTimeout(
                ()=>{
                  show('login');

                  const loginId=
                    document.getElementById(
                      'loveLoginId'
                    );

                  if(loginId){
                    loginId.value=id;
                    loginId.focus();
                  }

                },
                900
              );

            }

          }


          /* =========================
             로그인
          ========================= */

          if(action==='login'){

            const id=
              document
                .getElementById('loveLoginId')
                .value
                .trim();

            const pw=
              document
                .getElementById('loveLoginPassword')
                .value;


            if(!id){

              return msg(
                'loveLoginMessage',
                'ID를 입력해주세요.',
                true
              );

            }


            if(!pw){

              return msg(
                'loveLoginMessage',
                '비밀번호를 입력해주세요.',
                true
              );

            }


            const authEmail=
              makeAuthEmail(id);


            const {error}=
              await supabase.auth.signInWithPassword({

                email:authEmail,

                password:pw

              });


            if(error)throw error;


            msg(
              'loveLoginMessage',
              '로그인되었습니다.'
            );


            setTimeout(
              hide,
              700
            );


            window.dispatchEvent(
              new Event(
                'love-auth-changed'
              )
            );

          }

        }catch(err){

          console.error(err);

          let message=
            err?.message ||
            '처리 중 오류가 발생했습니다.';


          /*
            Supabase 에러를 사용자에게
            조금 더 자연스럽게 표시
          */

          if(
            /already registered|already exists|User already registered/i
              .test(message)
          ){

            message=
              '이미 사용 중인 ID입니다. 다른 ID를 사용해주세요.';

          }else if(
            /invalid login credentials/i
              .test(message)
          ){

            message=
              'ID 또는 비밀번호가 올바르지 않습니다.';

          }else if(
            /email/i.test(message) &&
            /invalid/i.test(message)
          ){

            message=
              '사용할 수 없는 ID입니다.';

          }


          const target=
            action==='signup'
              ? 'loveSignupMessage'
              : 'loveLoginMessage';


          msg(
            target,
            message,
            true
          );

        }finally{

          busy(btn,false);

        }

      }
    );


  document
    .querySelector(
      '#loveGlobalAuth .love-auth-close'
    )
    .addEventListener(
      'click',
      hide
    );


  overlay.addEventListener(
    'click',
    e=>{
      if(e.target===overlay)hide();
    }
  );


  document.addEventListener(
    'keydown',
    e=>{
      if(e.key==='Escape')hide();
    }
  );


  const lock=
    document.createElement('style');

  lock.textContent=
    'body.love-auth-lock{overflow:hidden}';

  document.head.appendChild(lock);


  if(supabase){

    supabase.auth.onAuthStateChange(
      (event,session)=>{

        window.dispatchEvent(
          new CustomEvent(
            'love-auth-state',
            {
              detail:{
                event,
                session
              }
            }
          )
        );

      }
    );


    supabase.auth.getSession()
      .then(({data})=>{

        window.LoveTeamSession=
          data.session;

      });

  }


  window.LoveTeamAuth={
    open:show,
    close:hide,
    client:supabase
  };
  // 로그인 상태를 홈페이지 헤더에 표시
  function updateLoveHeader(session){
    const loggedIn=!!session;
    const user=session?.user;
    const meta=user?.user_metadata||{};
    const username=meta.username||'회원';
    const name=meta.name||username;

    document.querySelectorAll('.header-actions a, .actions a').forEach(function(a){
      const text=(a.textContent||'').replace(/\s/g,'');
      if(a.classList.contains('kakao-btn')||a.classList.contains('kakao')) return;
      if(/장바구니|고객센터/.test(text)) return;

      if(loggedIn){
        if(!a.dataset.loveAuthStatus) return;

        a.textContent=name+'님 / 로그아웃';
        a.href='#logout';
        a.removeAttribute('data-auth-open');
        a.dataset.loveLogout='1';
      }else{
        if(a.dataset.loveLogout==='1'){
          a.textContent='로그인 / 회원가입';
          a.href='#';
          a.dataset.authOpen='1';
          a.dataset.loveLogout='';
        }
      }
    });

    document.querySelectorAll('#mobileOpenAuth').forEach(function(a){
      if(loggedIn){
        a.textContent=name+'님 / 로그아웃';
        a.href='#logout';
        a.dataset.loveLogout='1';
      }else{
        a.textContent='로그인 / 회원가입';
        a.href='#';
        a.dataset.loveLogout='';
      }
    });
  }

  // 헤더 로그인 버튼 표시용 표시 대상 지정
  document.querySelectorAll('.header-actions a, .actions a').forEach(function(a){
    const text=(a.textContent||'').replace(/\s/g,'');
    if(/로그인|회원가입/.test(text) && !/장바구니|고객센터/.test(text)){
      a.dataset.loveAuthStatus='1';
    }
  });

  // 로그아웃 처리
  document.addEventListener('click',async function(e){
    const logout=e.target.closest('[data-love-logout]');
    if(!logout)return;

    e.preventDefault();

    if(!supabase)return;

    const {error}=await supabase.auth.signOut();

    if(error){
      console.error(error);
      return;
    }

    updateLoveHeader(null);
    window.dispatchEvent(new Event('love-auth-changed'));
  });

  // 현재 로그인 상태 확인
  if(supabase){
    supabase.auth.getSession().then(function(result){
      const session=result?.data?.session||null;
      window.LoveTeamSession=session;
      updateLoveHeader(session);
    });

    supabase.auth.onAuthStateChange(function(event,session){
      window.LoveTeamSession=session;
      updateLoveHeader(session);
    });
  }
    /* =========================================
     LOVE TEAM 회원 메뉴
     ========================================= */

  const memberMenuStyle=document.createElement('style');

  memberMenuStyle.textContent=`
    .love-member-menu{
      position:fixed;
      width:280px;
      background:#fff;
      color:#222;
      border-radius:16px;
      box-shadow:0 20px 60px rgba(0,0,0,.28);
      padding:18px;
      z-index:100000;
      display:none;
      box-sizing:border-box;
      font-family:Arial,"Noto Sans KR",sans-serif;
    }

    .love-member-menu.show{
      display:block;
    }

    .love-member-head{
      padding-bottom:14px;
      border-bottom:1px solid #eee;
      margin-bottom:14px;
    }

    .love-member-kicker{
      font-size:9px;
      letter-spacing:1.5px;
      color:#8b56df;
      font-weight:800;
      margin-bottom:5px;
    }

    .love-member-name{
      font-size:17px;
      font-weight:900;
      color:#222;
    }

    .love-member-id{
      margin-top:4px;
      font-size:11px;
      color:#888;
    }

    .love-member-btn{
      width:100%;
      border:0;
      border-radius:9px;
      background:#f5f2fb;
      color:#333;
      padding:11px 12px;
      margin-top:7px;
      text-align:left;
      font-size:12px;
      font-weight:700;
      cursor:pointer;
    }

    .love-member-btn:hover{
      background:#eee9fa;
    }

    .love-member-btn.logout{
      background:#fff0f1;
      color:#c33;
    }

    .love-password-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.72);
      display:flex;
      align-items:center;
      justify-content:center;
      padding:18px;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .2s ease,visibility .2s ease;
      z-index:100001;
      font-family:Arial,"Noto Sans KR",sans-serif;
    }

    .love-password-overlay.show{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
    }

    .love-password-box{
      width:min(420px,100%);
      background:#fff;
      color:#222;
      border-radius:17px;
      padding:27px;
      box-sizing:border-box;
      position:relative;
      box-shadow:0 30px 90px rgba(0,0,0,.45);
    }

    .love-password-close{
      position:absolute;
      right:9px;
      top:6px;
      width:32px;
      height:32px;
      border:0;
      background:transparent;
      color:#777;
      font-size:23px;
      cursor:pointer;
    }

    .love-password-box .kicker{
      font-size:10px;
      letter-spacing:2px;
      color:#8b56df;
      font-weight:800;
      margin:0 0 6px;
    }

    .love-password-box h2{
      margin:0 0 18px;
      font-size:23px;
    }

    .love-password-box label{
      display:block;
      font-size:11px;
      font-weight:700;
      color:#444;
      margin-bottom:12px;
    }

    .love-password-box input{
      width:100%;
      height:42px;
      margin-top:6px;
      padding:9px 11px;
      border:1px solid #ddd9e8;
      border-radius:8px;
      box-sizing:border-box;
      outline:none;
      font:inherit;
    }

    .love-password-box input:focus{
      border-color:#8662ed;
      box-shadow:0 0 0 3px rgba(134,98,237,.1);
    }

    .love-password-help{
      font-size:10px;
      line-height:1.5;
      color:#777;
      margin:-1px 0 12px;
    }

    .love-password-message{
      display:none;
      padding:9px 11px;
      border-radius:8px;
      background:#f5f1ff;
      color:#6d4ee8;
      font-size:10px;
      line-height:1.5;
      margin-bottom:12px;
    }

    .love-password-message.error{
      background:#fff0f1;
      color:#c33;
    }

    .love-password-submit{
      width:100%;
      min-height:42px;
      border:0;
      border-radius:9px;
      background:linear-gradient(100deg,#4e8fff,#a64de9);
      color:#fff;
      font-size:13px;
      font-weight:800;
      cursor:pointer;
    }

    .love-password-submit:disabled{
      opacity:.6;
      cursor:wait;
    }

    @media(max-width:600px){

      .love-member-menu{
        width:calc(100vw - 34px);
        max-width:320px;
        left:50% !important;
        right:auto !important;
        transform:translateX(-50%);
        top:70px !important;
      }

      .love-password-overlay{
        padding:12px;
      }

      .love-password-box{
        width:calc(100vw - 34px);
        max-width:340px;
        padding:27px 18px 20px;
      }

    }
  `;

  document.head.appendChild(memberMenuStyle);


  /* 회원 메뉴 생성 */

  const memberMenu=document.createElement('div');

  memberMenu.className='love-member-menu';

  memberMenu.innerHTML=`
    <div class="love-member-head">

      <div class="love-member-kicker">
        LOVE TEAM MEMBER
      </div>

      <div class="love-member-name"
           id="loveMemberName">
        회원
      </div>

      <div class="love-member-id"
           id="loveMemberId">
        ID
      </div>

    </div>

    <button
      type="button"
      class="love-member-btn"
      id="loveOpenPassword">
      🔐 비밀번호 변경
    </button>

    <button
      type="button"
      class="love-member-btn logout"
      id="loveMemberLogout">
      🚪 로그아웃
    </button>
  `;

  document.body.appendChild(memberMenu);


  /* 비밀번호 변경창 */

  const passwordOverlay=document.createElement('div');

  passwordOverlay.className='love-password-overlay';

  passwordOverlay.innerHTML=`
    <div class="love-password-box">

      <button
        type="button"
        class="love-password-close"
        id="lovePasswordClose"
        aria-label="닫기">
        ×
      </button>

      <p class="kicker">
        LOVE TEAM MEMBER
      </p>

      <h2>
        비밀번호 변경
      </h2>

      <label>
        새 비밀번호

        <input
          type="password"
          id="loveNewPassword"
          placeholder="새 비밀번호를 입력해주세요"
          autocomplete="new-password">
      </label>

      <label>
        새 비밀번호 재확인

        <input
          type="password"
          id="loveNewPassword2"
          placeholder="새 비밀번호를 다시 입력해주세요"
          autocomplete="new-password">
      </label>

      <p class="love-password-help">
        비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
      </p>

      <p
        class="love-password-message"
        id="lovePasswordMessage">
      </p>

      <button
        type="button"
        class="love-password-submit"
        id="lovePasswordSubmit">
        비밀번호 변경
      </button>

    </div>
  `;

  document.body.appendChild(passwordOverlay);


  /* 회원 메뉴 위치 */

  function positionMemberMenu(target){

    if(!target)return;

    if(window.innerWidth<=600){

      memberMenu.style.top='70px';

      memberMenu.style.left='50%';

      return;

    }

    const rect=target.getBoundingClientRect();

    const menuWidth=280;

    let left=
      rect.right-menuWidth;

    let top=
      rect.bottom+10;

    if(left<10){
      left=10;
    }

    if(left+menuWidth>window.innerWidth-10){
      left=window.innerWidth-menuWidth-10;
    }

    if(top+memberMenu.offsetHeight>window.innerHeight-10){
      top=
        rect.top-
        memberMenu.offsetHeight-
        10;
    }

    if(top<10){
      top=10;
    }

    memberMenu.style.left=left+'px';
    memberMenu.style.top=top+'px';

  }


  function showMemberMenu(target){

    const session=
      window.LoveTeamSession;

    if(!session){

      if(window.LoveTeamAuth){
        window.LoveTeamAuth.open('login');
      }

      return;

    }

    const user=
      session.user;

    const meta=
      user?.user_metadata || {};

    const name=
      meta.name ||
      meta.username ||
      '회원';

    const username=
      meta.username ||
      'ID 없음';

    const nameEl=
      document.getElementById(
        'loveMemberName'
      );

    const idEl=
      document.getElementById(
        'loveMemberId'
      );

    if(nameEl){
      nameEl.textContent=
        name+'님';
    }

    if(idEl){
      idEl.textContent=
        'ID · '+username;
    }

    memberMenu.classList.add('show');

    positionMemberMenu(target);

  }


  function hideMemberMenu(){

    memberMenu.classList.remove(
      'show'
    );

  }


  function showPasswordChange(){

    hideMemberMenu();

    passwordOverlay.classList.add(
      'show'
    );

    const first=
      document.getElementById(
        'loveNewPassword'
      );

    if(first){

      first.value='';

      setTimeout(
        ()=>first.focus(),
        100
      );

    }

  }


  function hidePasswordChange(){

    passwordOverlay.classList.remove(
      'show'
    );

    const message=
      document.getElementById(
        'lovePasswordMessage'
      );

    if(message){

      message.style.display='none';

      message.textContent='';

      message.classList.remove(
        'error'
      );

    }

  }


  function passwordMessage(
    text,
    error=false
  ){

    const message=
      document.getElementById(
        'lovePasswordMessage'
      );

    if(!message)return;

    message.textContent=text;

    message.style.display='block';

    message.classList.toggle(
      'error',
      error
    );

  }


  /* 로그인 상태의 헤더 클릭 가로채기 */

  document.addEventListener(
    'click',
    function(e){

      const target=
        e.target.closest(
          '.header-actions a, .actions a, #mobileOpenAuth'
        );

      if(!target)return;

      const session=
        window.LoveTeamSession;

      if(!session)return;

      const isAuthButton=
        target.dataset.loveAuthStatus==='1' ||
        target.dataset.loveLogout==='1' ||
        /로그아웃/.test(
          (target.textContent||'')
        );

      if(!isAuthButton)return;

      e.preventDefault();

      e.stopImmediatePropagation();

      showMemberMenu(target);

    },
    true
  );


  /* 회원 메뉴 안 클릭 */

  document
    .getElementById('loveOpenPassword')
    .addEventListener(
      'click',
      function(){

        showPasswordChange();

      }
    );


  document
    .getElementById('loveMemberLogout')
    .addEventListener(
      'click',
      async function(){

        if(!supabase)return;

        this.disabled=true;

        try{

          const {error}=
            await supabase.auth.signOut();

          if(error)throw error;

          hideMemberMenu();

          window.LoveTeamSession=null;

          updateLoveHeader(null);

          window.dispatchEvent(
            new Event(
              'love-auth-changed'
            )
          );

        }catch(error){

          console.error(error);

        }finally{

          this.disabled=false;

        }

      }
    );


  /* 비밀번호 변경창 닫기 */

  document
    .getElementById('lovePasswordClose')
    .addEventListener(
      'click',
      hidePasswordChange
    );


  passwordOverlay.addEventListener(
    'click',
    function(e){

      if(
        e.target===
        passwordOverlay
      ){

        hidePasswordChange();

      }

    }
  );


  /* 비밀번호 변경 */

  document
    .getElementById('lovePasswordSubmit')
    .addEventListener(
      'click',
      async function(){

        if(!supabase){

          passwordMessage(
            'Supabase 연결 정보를 불러오지 못했습니다.',
            true
          );

          return;

        }

        const password=
          document
            .getElementById(
              'loveNewPassword'
            )
            .value;

        const password2=
          document
            .getElementById(
              'loveNewPassword2'
            )
            .value;


        if(
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
            .test(password)
        ){

          passwordMessage(
            '비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
            true
          );

          return;

        }


        if(password!==password2){

          passwordMessage(
            '비밀번호 재확인이 일치하지 않습니다.',
            true
          );

          return;

        }


        this.disabled=true;

        this.textContent=
          '변경 중...';


        try{

          const {error}=
            await supabase.auth.updateUser({
              password:password
            });

          if(error)throw error;


          passwordMessage(
            '비밀번호가 변경되었습니다.'
          );


          document
            .getElementById(
              'loveNewPassword'
            )
            .value='';

          document
            .getElementById(
              'loveNewPassword2'
            )
            .value='';


          setTimeout(
            hidePasswordChange,
            900
          );


        }catch(error){

          console.error(error);

          let message=
            error?.message ||
            '비밀번호 변경 중 오류가 발생했습니다.';

          if(
            /password/i.test(message)
          ){

            message=
              '비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해주세요.';

          }

          passwordMessage(
            message,
            true
          );

        }finally{

          this.disabled=false;

          this.textContent=
            '비밀번호 변경';

        }

      }
    );


  /* 바깥 클릭으로 회원 메뉴 닫기 */

  document.addEventListener(
    'click',
    function(e){

      if(
        !memberMenu.contains(e.target) &&
        !e.target.closest(
          '.header-actions a, .actions a, #mobileOpenAuth'
        )
      ){

        hideMemberMenu();

      }

    }
  );


  /* 화면 크기 변경 */

  window.addEventListener(
    'resize',
    function(){

      hideMemberMenu();

    }
  );


  /* ESC */

  document.addEventListener(
    'keydown',
    function(e){

      if(e.key==='Escape'){

        hideMemberMenu();

        hidePasswordChange();

      }

    }
  );
})();
