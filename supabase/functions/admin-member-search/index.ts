import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-member-search started");

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      try {
        console.info("admin-member-search request received");
        const adminUserId =
          (Deno.env.get("ADMIN_USER_ID") || "").trim();

        const {
          data: { user: caller },
          error: callerError
        } = await ctx.supabase.auth.getUser();

        const callerId =
          String(caller?.id || "").trim();

        console.info(
          "admin-member-search auth check",
          {
            hasAdminUserId: !!adminUserId,
            hasCallerId: !!callerId,
            callerError: callerError?.message || null,
            isAdmin:
              !!adminUserId &&
              !!callerId &&
              callerId === adminUserId
          }
        );

        if (
          callerError ||
          !caller ||
          !adminUserId ||
          !callerId ||
          callerId !== adminUserId
        ) {
          return Response.json({
            ok: false,
            admin: false,
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
        const username = String(body?.username || "").trim().toLowerCase();
        console.info("admin-member-search username received", { hasUsername: !!username });

        if (!username) {
          return Response.json({
            ok: false,
            message: "회원 ID를 입력해주세요."
          }, { status: 400 });
        }

        if (!/^[a-z0-9_.-]{3,50}$/.test(username)) {
          return Response.json({
            ok: false,
            message: "올바른 회원 ID 형식이 아닙니다."
          }, { status: 400 });
        }

        const email = username + "@love-team.local";

        // Supabase Admin API는 한 번에 최대 1000명까지만 반환할 수 있으므로,
        // 회원 수가 1000명을 넘어도 정확한 ID 검색이 가능하도록 페이지를 순회합니다.
        const perPage = 1000;
        let user = null;

        for (let page = 1; page <= 100; page += 1) {
          const { data, error } =
            await ctx.supabaseAdmin.auth.admin.listUsers({
              page,
              perPage
            });

          if (error) {
            console.error("listUsers error:", error);
            return Response.json({
              ok: false,
              message: "회원 정보를 조회하지 못했습니다."
            }, { status: 500 });
          }

          const users = data?.users || [];
          user = users.find(
            (item) => String(item.email || "").toLowerCase() === email
          ) || null;

          if (user || users.length < perPage) break;
        }

        if (!user) {
          return Response.json({
            ok: true,
            found: false,
            message: "해당 회원을 찾을 수 없습니다."
          });
        }

        const metadata = user.user_metadata || {};

        return Response.json({
          ok: true,
          found: true,
          user: {
            id: user.id,
            username: metadata.username || username,
            name: metadata.name || "",
            created_at: user.created_at || null,
            last_sign_in_at: user.last_sign_in_at || null
          }
        });
      } catch (error) {
        console.error("admin-member-search error:", error);
        return Response.json({
          ok: false,
          message: "회원 검색 중 서버 오류가 발생했습니다."
        }, { status: 500 });
      }
    }
  )
};
