import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-notice-management started");

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      try {
        const adminUserId = (Deno.env.get("ADMIN_USER_ID") || "").trim();
        const {
          data: { user: caller },
          error: callerError
        } = await ctx.supabase.auth.getUser();

        if (callerError || !caller || !adminUserId || caller.id !== adminUserId) {
          return Response.json({ ok:false, message:"관리자 권한이 없습니다." }, {status:403});
        }

        if (req.method !== "POST") {
          return Response.json({ ok:false, message:"POST 요청만 허용됩니다." }, {status:405});
        }

        const body = await req.json().catch(() => ({}));
        const action = clean(body?.action);

        if (action === "list") {
          const {data,error}=await ctx.supabaseAdmin
            .from("notices")
            .select("id,title,summary,content,author,published_at,created_at,updated_at")
            .order("published_at",{ascending:false})
            .order("id",{ascending:false});

          if(error){
            console.error("notice list error:",error.message);
            return Response.json({ok:false,message:"공지사항 목록을 불러오지 못했습니다."},{status:500});
          }
          return Response.json({ok:true,notices:data||[]});
        }

        if (["create","update"].includes(action)) {
          const title=clean(body?.title);
          const summary=clean(body?.summary);
          const content=clean(body?.content);
          const author=clean(body?.author) || "관리자";
          const publishedAt=clean(body?.published_at);

          if(!title || title.length>120) return Response.json({ok:false,message:"제목은 1~120자로 입력해주세요."},{status:400});
          if(summary.length>300) return Response.json({ok:false,message:"요약은 300자 이내로 입력해주세요."},{status:400});
          if(!content || content.length>10000) return Response.json({ok:false,message:"본문은 1~10000자로 입력해주세요."},{status:400});
          if(author.length>30) return Response.json({ok:false,message:"작성자는 30자 이내로 입력해주세요."},{status:400});
          if(!validDate(publishedAt)) return Response.json({ok:false,message:"작성일 형식이 올바르지 않습니다."},{status:400});

          if(action==="create"){
            const {data,error}=await ctx.supabaseAdmin
              .from("notices")
              .insert({title,summary,content,author,published_at:publishedAt})
              .select("id,title,summary,content,author,published_at,created_at,updated_at")
              .single();

            if(error){
              console.error("notice create error:",error.message);
              return Response.json({ok:false,message:"공지사항을 등록하지 못했습니다."},{status:500});
            }
            return Response.json({ok:true,notice:data,message:"공지사항이 등록되었습니다."});
          }

          const id=Number(body?.id);
          if(!Number.isInteger(id) || id<1) return Response.json({ok:false,message:"공지사항 ID가 올바르지 않습니다."},{status:400});

          const {data,error}=await ctx.supabaseAdmin
            .from("notices")
            .update({title,summary,content,author,published_at:publishedAt,updated_at:new Date().toISOString()})
            .eq("id",id)
            .select("id,title,summary,content,author,published_at,created_at,updated_at")
            .single();

          if(error){
            console.error("notice update error:",error.message);
            return Response.json({ok:false,message:"공지사항을 수정하지 못했습니다."},{status:500});
          }
          return Response.json({ok:true,notice:data,message:"공지사항이 수정되었습니다."});
        }

        if(action==="delete"){
          const id=Number(body?.id);
          if(!Number.isInteger(id) || id<1) return Response.json({ok:false,message:"공지사항 ID가 올바르지 않습니다."},{status:400});
          const {error}=await ctx.supabaseAdmin.from("notices").delete().eq("id",id);
          if(error){
            console.error("notice delete error:",error.message);
            return Response.json({ok:false,message:"공지사항을 삭제하지 못했습니다."},{status:500});
          }
          return Response.json({ok:true,message:"공지사항이 삭제되었습니다."});
        }

        return Response.json({ok:false,message:"올바른 작업 요청이 아닙니다."},{status:400});
      } catch(error) {
        console.error("admin-notice-management error:",error);
        return Response.json({ok:false,message:"공지사항 관리 중 서버 오류가 발생했습니다."},{status:500});
      }
    }
  )
};