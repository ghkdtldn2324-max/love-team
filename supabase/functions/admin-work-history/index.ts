import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-work-history started");

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
          return Response.json(
            { ok: false, message: "관리자 권한이 없습니다." },
            { status: 403 }
          );
        }

        if (req.method !== "POST") {
          return Response.json(
            { ok: false, message: "POST 요청만 허용됩니다." },
            { status: 405 }
          );
        }

        const body = await req.json().catch(() => ({}));
        const action = String(body?.action || "").trim();

        if (!["list", "create", "update", "delete"].includes(action)) {
          return Response.json(
            { ok: false, message: "올바른 작업 요청이 아닙니다." },
            { status: 400 }
          );
        }

        if (action === "list") {
          const { data, error } = await ctx.supabaseAdmin
            .from("work_history")
            .select("id,display_name,detail,status,created_at,updated_at")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("work list error:", error.message);
            return Response.json(
              { ok: false, message: "작업 내역을 불러오지 못했습니다." },
              { status: 500 }
            );
          }

          return Response.json({
            ok: true,
            works: data || []
          });
        }

        if (action === "delete") {
          const id = String(body?.id || "").trim();

          if (!id) {
            return Response.json(
              { ok: false, message: "작업 ID가 없습니다." },
              { status: 400 }
            );
          }

          const { error } = await ctx.supabaseAdmin
            .from("work_history")
            .delete()
            .eq("id", id);

          if (error) {
            console.error("work delete error:", error.message);
            return Response.json(
              { ok: false, message: "작업 내역을 삭제하지 못했습니다." },
              { status: 500 }
            );
          }

          return Response.json({
            ok: true,
            message: "작업 내역이 삭제되었습니다."
          });
        }

        const displayName = String(body?.display_name || "").trim();
        const detail = String(body?.detail || "").trim();
        const status = String(body?.status || "").trim();

        if (!displayName || !detail) {
          return Response.json(
            { ok: false, message: "관리자 이름과 게시글 내용을 입력해주세요." },
            { status: 400 }
          );
        }

        if (displayName.length > 40) {
          return Response.json(
            { ok: false, message: "관리자 이름은 40자 이내로 입력해주세요." },
            { status: 400 }
          );
        }

        if (!["progress", "done"].includes(status)) {
          return Response.json(
            { ok: false, message: "작업 상태가 올바르지 않습니다." },
            { status: 400 }
          );
        }

        let parsedDetail = null;

        try {
          const parsed = JSON.parse(detail);

          if (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
          ) {
            parsedDetail = parsed;
          }
        } catch (_) {
          parsedDetail = null;
        }

        if (parsedDetail) {
          const title = String(parsedDetail.title || "").trim();
          const content = String(parsedDetail.content || "").trim();

          if (!title || !content) {
            return Response.json(
              {
                ok: false,
                message: "게시글 제목과 내용을 모두 입력해주세요."
              },
              { status: 400 }
            );
          }

          if (title.length > 100) {
            return Response.json(
              {
                ok: false,
                message: "게시글 제목은 100자 이내로 입력해주세요."
              },
              { status: 400 }
            );
          }

          if (content.length > 2000) {
            return Response.json(
              {
                ok: false,
                message: "게시글 내용은 2,000자 이내로 입력해주세요."
              },
              { status: 400 }
            );
          }
        } else if (detail.length > 2000) {
          return Response.json(
            {
              ok: false,
              message: "작업 내용은 2,000자 이내로 입력해주세요."
            },
            { status: 400 }
          );
        }

        if (action === "create") {
          const { data, error } = await ctx.supabaseAdmin
            .from("work_history")
            .insert({
              display_name: displayName,
              detail,
              status
            })
            .select()
            .single();

          if (error) {
            console.error("work create error:", error.message);
            return Response.json(
              { ok: false, message: "작업 내역을 등록하지 못했습니다." },
              { status: 500 }
            );
          }

          return Response.json({
            ok: true,
            message: "작업 내역이 등록되었습니다.",
            work: data
          });
        }

        const id = String(body?.id || "").trim();

        if (!id) {
          return Response.json(
            { ok: false, message: "작업 ID가 없습니다." },
            { status: 400 }
          );
        }

        const { data, error } = await ctx.supabaseAdmin
          .from("work_history")
          .update({
            display_name: displayName,
            detail,
            status,
            updated_at: new Date().toISOString()
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("work update error:", error.message);
          return Response.json(
            { ok: false, message: "작업 내역을 수정하지 못했습니다." },
            { status: 500 }
          );
        }

        return Response.json({
          ok: true,
          message: "작업 내역이 수정되었습니다.",
          work: data
        });
      } catch (error) {
        console.error("admin-work-history error:", error);

        return Response.json(
          {
            ok: false,
            message: "작업 내역 처리 중 서버 오류가 발생했습니다."
          },
          { status: 500 }
        );
      }
    }
  )
};