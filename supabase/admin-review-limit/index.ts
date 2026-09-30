import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-review-limit started");

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
        const action = String(body?.action || "clear").trim();
        const userId = String(body?.user_id || "").trim();

        if (!userId) {
          return Response.json(
            { ok: false, message: "회원 정보를 확인할 수 없습니다." },
            { status: 400 }
          );
        }

        if (action === "status") {
          const { data, error } = await ctx.supabaseAdmin
            .from("review_write_limits")
            .select("blocked_until")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            console.error("review limit status error:", error);
            return Response.json(
              { ok: false, message: "후기 작성 제한 상태 확인에 실패했습니다." },
              { status: 500 }
            );
          }

          const blockedUntil = data?.blocked_until || null;
          const isBlocked =
            !!blockedUntil &&
            new Date(blockedUntil).getTime() > Date.now();

          return Response.json({
            ok: true,
            blocked: isBlocked,
            blocked_until: isBlocked ? blockedUntil : null,
            message: isBlocked
              ? "후기 작성 제한 중입니다."
              : "현재 후기 작성 제한이 없습니다."
          });
        }

        const { error } = await ctx.supabaseAdmin
          .from("review_write_limits")
          .upsert(
            {
              user_id: userId,
              blocked_until: null,
              updated_at: new Date().toISOString()
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error("review limit clear error:", error);

          return Response.json(
            {
              ok: false,
              message: "후기 작성 제한 해제에 실패했습니다."
            },
            { status: 500 }
          );
        }

        return Response.json({
          ok: true,
          message: "해당 회원의 후기 작성 제한이 해제되었습니다."
        });

      } catch (error) {
        console.error("admin-review-limit error:", error);

        return Response.json(
          {
            ok: false,
            message: "후기 작성 제한 해제 중 서버 오류가 발생했습니다."
          },
          { status: 500 }
        );
      }
    }
  )
};
