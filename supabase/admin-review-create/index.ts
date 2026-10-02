import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-review-create started");

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      try {
        if (req.method !== "POST") {
          return Response.json(
            { ok: false, message: "POST 요청만 허용됩니다." },
            { status: 405 }
          );
        }

        const {
          data: { user },
          error: userError
        } = await ctx.supabase.auth.getUser();

        if (userError || !user) {
          return Response.json(
            { ok: false, message: "관리자 로그인이 필요합니다." },
            { status: 401 }
          );
        }

        const adminUserId = Deno.env.get("ADMIN_USER_ID");
        if (!adminUserId || user.id !== adminUserId.trim()) {
          return Response.json(
            { ok: false, message: "관리자 권한이 없습니다." },
            { status: 403 }
          );
        }

        const body = await req.json().catch(() => ({}));
        const stars = Number(body?.stars);
        const title = String(body?.title || "").trim();
        const content = String(body?.content || "").trim();
        const service = String(body?.service || "").trim();
        const userId = String(body?.user_id || "").trim();

        if (userId !== user.id) {
          return Response.json(
            { ok: false, message: "후기 작성 회원 정보를 확인할 수 없습니다." },
            { status: 400 }
          );
        }

        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
          return Response.json(
            { ok: false, message: "별점은 1~5점만 가능합니다." },
            { status: 400 }
          );
        }

        if (!title || title.length > 120) {
          return Response.json(
            { ok: false, message: "후기 제목은 1~120자로 작성해주세요." },
            { status: 400 }
          );
        }

        if (content.length < 5 || content.length > 300) {
          return Response.json(
            { ok: false, message: "후기는 5~300자로 작성해주세요." },
            { status: 400 }
          );
        }

        if (!["승당", "듀오", "티어", "배치고사", "1:1"].includes(service)) {
          return Response.json(
            { ok: false, message: "서비스 종류가 올바르지 않습니다." },
            { status: 400 }
          );
        }

        const meta = user.user_metadata || {};
        const displayName = String(meta.name || "회원").trim() || "회원";

        // 관리자 계정은 기존 1시간 제한 기록이 있어도 이번 작성은 허용하고,
        // 작성 직후 제한 기록을 제거하여 다음 관리자 후기에도 제한이 걸리지 않게 한다.
        await ctx.supabaseAdmin
          .from("review_write_limits")
          .delete()
          .eq("user_id", user.id);

        const { data, error } = await ctx.supabaseAdmin
          .from("reviews")
          .insert({
            user_id: user.id,
            display_name: displayName,
            stars,
            title,
            content,
            service
          })
          .select("id,display_name,stars,title,content,service,created_at")
          .single();

        if (error) {
          console.error("admin review insert error:", error);
          return Response.json(
            { ok: false, message: "관리자 후기 등록에 실패했습니다." },
            { status: 500 }
          );
        }

        await ctx.supabaseAdmin
          .from("review_write_limits")
          .delete()
          .eq("user_id", user.id);

        return Response.json({ ok: true, review: data });
      } catch (error) {
        console.error("admin-review-create error:", error);
        return Response.json(
          { ok: false, message: "관리자 후기 등록 중 서버 오류가 발생했습니다." },
          { status: 500 }
        );
      }
    }
  )
};