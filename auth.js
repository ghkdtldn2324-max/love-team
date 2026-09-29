(function(){
  if(document.getElementById('loveGlobalAuth')) return;
  const css=`
  .love-auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .22s ease,visibility .22s ease;z-index:99999;font-family:Arial,"Noto Sans KR",sans-serif}
  .love-auth-overlay.show{opacity:1;visibility:visible;pointer-events:auto}
  .love-auth-modal{width:min(450px,100%);max-height:92vh;overflow:auto;background:#fff;color:#222;border-radius:18px;box-shadow:0 30px 90px rgba(0,0,0,.45);padding:28px;position:relative;transform:translateY(18px) scale(.98);transition:transform .24s ease}
  .love-auth-overlay.show .love-auth-modal{transform:translateY(0) scale(1)}
  .love-auth-close{position:absolute;right:14px;top:9px;border:0;background:transparent;color:#777;font-size:29px;cursor:pointer;line-height:1;padding:4px 8px}
  .love-auth-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:#f3f1f8;border-radius:10px;padding:4px;margin-bottom:23px}
  .love-auth-tab{border:0;background:transparent;color:#777;border-radius:8px;padding:10px 4px;font-size:12px;font-weight:800;cursor:pointer}
  .love-auth-tab.active{background:linear-gradient(100deg,#4e8fff,#a64de9);color:#fff;box-shadow:0 5px 14px rgba(105,86,226,.2)}
  .love-auth-kicker{font-size:10px;letter-spacing:2px;color:#8b56df;font-weight:800;margin:0 0 6px}
  .love-auth-panel h2{margin:0 0 18px;font-size:27px;color:#222}
  .love-auth-panel p.desc{margin:-8px 0 17px;color:#777;font-size:12px;line-height:1.55}
  .love-auth-panel label{display:block;font-size:12px;font-weight:700;color:#444;margin:0 0 13px}
  .love-auth-panel input{width:100%;margin-top:7px;padding:12px 13px;border:1px solid #ddd9e8;border-radius:9px;outline:none;font:inherit;color:#222;background:#fff;box-sizing:border-box}
  .love-auth-panel input:focus{border-color:#8662ed;box-shadow:0 0 0 3px rgba(134,98,237,.1)}
  .love-auth-help{font-size:11px;color:#777;margin:-2px 0 14px;line-height:1.5}
  .love-auth-submit{width:100%;border:0;border-radius:9px;padding:13px;background:linear-gradient(100deg,#4e8fff,#a64de9);color:#fff;font-weight:800;cursor:pointer}
  .love-auth-submit:disabled{opacity:.6;cursor:wait}
  .love-auth-links{display:flex;justify-content:center;gap:15px;margin-top:13px;font-size:11px;color:#777}
  .love-auth-links button{border:0;background:none;color:#6d4ee8;padding:0;cursor:pointer;font:inherit;font-weight:700}
  .love-auth-message{display:none;margin:0 0 14px;padding:10px 12px;border-radius:8px;background:#f5f1ff;color:#6d4ee8;font-size:11px;line-height:1.5}
  .love-auth-message.error{background:#fff0f1;color:#c33}
  @media(max-width:520px){.love-auth-modal{padding:24px 18px}.love-auth-tabs{grid-template-columns:repeat(2,1fr)}.love-auth-tab{padding:10px 3px}}
  `;
  const style=document.createElement('style');style.id='loveGlobalAuthStyle';style.textContent=css;document.head.appendChild(style);
  const wrap=document.createElement('div');wrap.id='loveGlobalAuth';wrap.innerHTML=`
  <div class="love-auth-overlay" id="loveAuthOverlay" aria-hidden="true">
    <div class="love-auth-modal" role="dialog" aria-modal="true" aria-labelledby="loveAuthTitle">
      <button class="love-auth-close" type="button" aria-label="닫기">×</button>
      <div class="love-auth-tabs">
        <button class="love-auth-tab active" type="button" data-mode="login">로그인</button>
        <button class="love-auth-tab" type="button" data-mode="signup">회원가입</button>
        <button class="love-auth-tab" type="button" data-mode="find-id">아이디 찾기</button>
        <button class="love-auth-tab" type="button" data-mode="find-pw">비밀번호 찾기</button>
      </div>
      <div class="love-auth-panel" data-panel="login">
        <p class="love-auth-kicker">LOVE TEAM MEMBER</p><h2 id="loveAuthTitle">로그인</h2>
        <label>이메일<input type="email" id="loveLoginEmail" placeholder="이메일을 입력해주세요" autocomplete="email"></label>
        <label>비밀번호<input type="password" id="loveLoginPassword" placeholder="비밀번호를 입력해주세요" autocomplete="current-password"></label>
        <p class="love-auth-message" id="loveLoginMessage"></p>
        <button class="love-auth-submit" type="button" data-submit="login">로그인</button>
        <div class="love-auth-links"><button type="button" data-go="find-id">아이디 찾기</button><button type="button" data-go="find-pw">비밀번호 찾기</button></div>
      </div>
      <div class="love-auth-panel" data-panel="signup" hidden>
        <p class="love-auth-kicker">LOVE TEAM MEMBER</p><h2>회원가입</h2>
        <label>이름<input type="text" id="loveSignupName" placeholder="이름을 입력해주세요" autocomplete="name"></label>
        <label>이메일<input type="email" id="loveSignupEmail" placeholder="이메일을 입력해주세요" autocomplete="email"></label>
        <label>비밀번호<input type="password" id="loveSignupPassword" placeholder="비밀번호를 입력해주세요" autocomplete="new-password"></label>
        <label>비밀번호 재입력<input type="password" id="loveSignupPassword2" placeholder="비밀번호를 다시 입력해주세요" autocomplete="new-password"></label>
        <p class="love-auth-help">8자리 이상의 대소문자, 숫자, 특수문자를 사용해 주세요.</p>
        <p class="love-auth-message" id="loveSignupMessage"></p>
        <button class="love-auth-submit" type="button" data-submit="signup">회원가입</button>
      </div>
      <div class="love-auth-panel" data-panel="find-id" hidden>
        <p class="love-auth-kicker">ACCOUNT RECOVERY</p><h2>아이디 찾기</h2>
        <p class="desc">가입할 때 입력한 이름과 이메일을 확인해 주세요.</p>
        <label>이름<input type="text" id="loveFindIdName" placeholder="가입한 이름"></label>
        <label>이메일<input type="email" id="loveFindIdEmail" placeholder="가입한 이메일"></label>
        <p class="love-auth-message" id="loveFindIdMessage"></p>
        <button class="love-auth-submit" type="button" data-submit="find-id">아이디 찾기</button>
      </div>
      <div class="love-auth-panel" data-panel="find-pw" hidden>
        <p class="love-auth-kicker">ACCOUNT RECOVERY</p><h2>비밀번호 찾기</h2>
        <p class="desc">가입한 이메일로 비밀번호 재설정 안내를 받을 수 있습니다.</p>
        <label>이메일<input type="email" id="loveFindPwEmail" placeholder="가입한 이메일"></label>
        <p class="love-auth-message" id="loveFindPwMessage"></p>
        <button class="love-auth-submit" type="button" data-submit="find-pw">재설정 이메일 보내기</button>
      </div>
      <div class="love-auth-panel" data-panel="reset-pw" hidden>
        <p class="love-auth-kicker">ACCOUNT RECOVERY</p><h2>새 비밀번호 설정</h2>
        <p class="desc">새 비밀번호를 입력하면 계정 비밀번호가 변경됩니다.</p>
        <label>새 비밀번호<input type="password" id="loveResetPassword" placeholder="새 비밀번호" autocomplete="new-password"></label>
        <label>비밀번호 재입력<input type="password" id="loveResetPassword2" placeholder="비밀번호 다시 입력" autocomplete="new-password"></label>
        <p class="love-auth-message" id="loveResetMessage"></p>
        <button class="love-auth-submit" type="button" data-submit="reset-pw">비밀번호 변경</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(wrap);
  const overlay=document.getElementById('loveAuthOverlay');
  const panels=[...document.querySelectorAll('#loveGlobalAuth .love-auth-panel')];
  const tabs=[...document.querySelectorAll('#loveGlobalAuth .love-auth-tab')];
  let supabase=null;
  try{
    if(window.supabase && window.LOVE_TEAM_SUPABASE_URL && window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY){
      supabase=window.supabase.createClient(window.LOVE_TEAM_SUPABASE_URL,window.LOVE_TEAM_SUPABASE_PUBLISHABLE_KEY);
      window.LoveTeamSupabase=supabase;
    }
  }catch(e){console.error(e)}
  function show(mode){overlay.classList.add('show');overlay.setAttribute('aria-hidden','false');document.body.classList.add('love-auth-lock');tabs.forEach(t=>t.classList.toggle('active',t.dataset.mode===mode));panels.forEach(p=>p.hidden=p.dataset.panel!==mode);}
  function hide(){overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('love-auth-lock');}
  function msg(id,text,error=false){const m=document.getElementById(id);if(!m)return;m.style.display='block';m.textContent=text;m.classList.toggle('error',error)}
  function clearMessages(){document.querySelectorAll('#loveGlobalAuth .love-auth-message').forEach(m=>{m.style.display='none';m.textContent='';m.classList.remove('error')})}
  function busy(btn,on){if(btn){btn.disabled=on;btn.dataset.oldText=btn.dataset.oldText||btn.textContent;btn.textContent=on?'처리 중...':btn.dataset.oldText}}
  function bindOpeners(){
    document.querySelectorAll('a[href="login.html"],a[href="signup.html"],a[href="#login"],a[href="#signup"],a[data-auth-open],a[href="#auth"]').forEach(a=>{
      if(a.dataset.loveAuthBound)return; a.dataset.loveAuthBound='1';
      a.addEventListener('click',e=>{e.preventDefault();const text=(a.textContent||'').trim();show(/회원가입/.test(text)||a.getAttribute('href')==='#signup'?'signup':'login');});
    });
    document.querySelectorAll('.header-actions a, .actions a').forEach(a=>{
      const text=(a.textContent||'').replace(/\s/g,'');
      if(/로그인.*회원가입|로그인|회원가입/.test(text) && !/장바구니|고객센터/.test(text) && !a.dataset.loveAuthBound){
        a.dataset.loveAuthBound='1';a.addEventListener('click',e=>{e.preventDefault();show(text.includes('회원가입')&&!text.includes('로그인')?'signup':'login');});
      }
    });
  }
  bindOpeners();
  document.getElementById('loveGlobalAuth').addEventListener('click',async e=>{
    const t=e.target.closest('[data-mode],[data-go],[data-submit]'); if(!t)return;
    if(t.dataset.mode){clearMessages();show(t.dataset.mode);return}
    if(t.dataset.go){clearMessages();show(t.dataset.go);return}
    const btn=t; const action=btn.dataset.submit; busy(btn,true);
    try{
      if(!supabase) throw new Error('Supabase 연결 정보를 불러오지 못했습니다.');
      if(action==='signup'){
        const name=document.getElementById('loveSignupName').value.trim(),email=document.getElementById('loveSignupEmail').value.trim(),pw=document.getElementById('loveSignupPassword').value,pw2=document.getElementById('loveSignupPassword2').value;
        if(!name)return msg('loveSignupMessage','이름을 입력해주세요.',true);
        if(!email)return msg('loveSignupMessage','이메일을 입력해주세요.',true);
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw))return msg('loveSignupMessage','비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',true);
        if(pw!==pw2)return msg('loveSignupMessage','비밀번호 재입력이 일치하지 않습니다.',true);
        const redirectTo=window.location.origin + '/love-team/index.html';
        const {data,error}=await supabase.auth.signUp({email,password:pw,options:{data:{name},emailRedirectTo:redirectTo}});
        if(error)throw error;
        if(data.user){msg('loveSignupMessage',data.session?'회원가입이 완료되었습니다.':'가입 확인 이메일을 확인해주세요. 이메일 인증 후 로그인할 수 있습니다.');}
      }
      if(action==='login'){
        const email=document.getElementById('loveLoginEmail').value.trim(),pw=document.getElementById('loveLoginPassword').value;
        if(!email)return msg('loveLoginMessage','이메일을 입력해주세요.',true);
        if(!pw)return msg('loveLoginMessage','비밀번호를 입력해주세요.',true);
        const {error}=await supabase.auth.signInWithPassword({email,password:pw}); if(error)throw error;
        msg('loveLoginMessage','로그인되었습니다.'); setTimeout(hide,700); window.dispatchEvent(new Event('love-auth-changed'));
      }
      if(action==='find-id'){
        const name=document.getElementById('loveFindIdName').value.trim(),email=document.getElementById('loveFindIdEmail').value.trim();
        if(!name||!email)return msg('loveFindIdMessage','이름과 이메일을 모두 입력해주세요.',true);
        // 아이디가 이메일인 구조이므로, 비밀번호 재설정과 달리 임의의 계정 존재 여부를 노출하지 않습니다.
        msg('loveFindIdMessage','회원가입 때 사용한 이메일이 아이디입니다. 입력한 이메일을 확인해 주세요.');
      }
      if(action==='find-pw'){
        const email=document.getElementById('loveFindPwEmail').value.trim(); if(!email)return msg('loveFindPwMessage','가입한 이메일을 입력해주세요.',true);
        const redirectTo=window.location.origin + '/love-team/index.html';
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo}); if(error)throw error;
        msg('loveFindPwMessage','입력한 이메일로 비밀번호 재설정 안내를 요청했습니다. 메일함을 확인해주세요.');
      }
      if(action==='reset-pw'){
        const pw=document.getElementById('loveResetPassword').value,pw2=document.getElementById('loveResetPassword2').value;
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw))return msg('loveResetMessage','비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',true);
        if(pw!==pw2)return msg('loveResetMessage','비밀번호 재입력이 일치하지 않습니다.',true);
        const {error}=await supabase.auth.updateUser({password:pw}); if(error)throw error;
        msg('loveResetMessage','비밀번호가 변경되었습니다. 다시 로그인해주세요.'); setTimeout(hide,1000);
      }
    }catch(err){
      console.error(err); const message=err?.message||'처리 중 오류가 발생했습니다.';
      const target={signup:'loveSignupMessage',login:'loveLoginMessage','find-id':'loveFindIdMessage','find-pw':'loveFindPwMessage','reset-pw':'loveResetMessage'}[action]; if(target)msg(target,message,true);
    }finally{busy(btn,false)}
  });
  document.querySelector('#loveGlobalAuth .love-auth-close').addEventListener('click',hide);
  overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
  const lock=document.createElement('style');lock.textContent='body.love-auth-lock{overflow:hidden}';document.head.appendChild(lock);
  if(supabase){
    supabase.auth.onAuthStateChange((event,session)=>{window.dispatchEvent(new CustomEvent('love-auth-state',{detail:{event,session}}));});
    supabase.auth.getSession().then(({data})=>{window.LoveTeamSession=data.session;});
  }
  window.LoveTeamAuth={open:show,close:hide,client:supabase};
  // 비밀번호 재설정 링크로 돌아온 경우 자동으로 새 비밀번호 화면을 띄웁니다.
  if(supabase){supabase.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')show('reset-pw');});}
})();
