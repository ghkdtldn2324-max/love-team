import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-review-management started");

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

        if (
          callerError ||
          !caller ||
          !adminUserId ||
          caller.id !== adminUserId
        ) {
          return Response.json({
            ok: false,
            message: "관리자 권한이 없습니다."
          }, { status: 403 });
        }

        if (req.method !== "POST") {
          return Response.json({
            ok: false,
            message: "POST 요청만 허용됩니다."
          }, { status: 405 });
        }

        const body = await req.json().catch(() => ({}));
        const action = String(body?.action || "").trim();

        if (action === "list") {
          const { data, error } = await ctx.supabaseAdmin
            .from("reviews")
            .select("id,display_name,stars,content,service,created_at")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("review list error:", error.message);
            return Response.json({
              ok: false,
              message: "후기 목록을 불러오지 못했습니다."
            }, { status: 500 });
          }

          return Response.json({
            ok: true,
            reviews: data || []
          });
        }

        if (action === "delete") {
          const id = String(body?.id || "").trim();

          if (!id) {
            return Response.json({
              ok: false,
              message: "후기 ID가 없습니다."
            }, { status: 400 });
          }

          const { error } = await ctx.supabaseAdmin
            .from("reviews")
            .delete()
            .eq("id", id);

          if (error) {
            console.error("review delete error:", error.message);
            return Response.json({
              ok: false,
              message: "후기를 삭제하지 못했습니다."
            }, { status: 500 });
          }

          return Response.json({
            ok: true,
            message: "후기가 삭제되었습니다."
          });
        }

        return Response.json({
          ok: false,
          message: "올바른 작업 요청이 아닙니다."
        }, { status: 400 });
      } catch (error) {
        console.error("admin-review-management error:", error);
        return Response.json({
          ok: false,
          message: "후기 관리 중 서버 오류가 발생했습니다."
        }, { status: 500 });
      }
    }
  )
};
