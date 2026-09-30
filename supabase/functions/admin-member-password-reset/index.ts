import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("admin-member-password-reset started");

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      try {
        const adminUserId =
          (Deno.env.get("ADMIN_USER_ID") || "").trim();

        const {
          data: { user: caller },
          error: callerError
        } = await ctx.supabase.auth.getUser();

        const callerId =
          String(caller?.id || "").trim();

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

        const userId =
          String(body?.user_id || "").trim();

        const newPassword =
          String(body?.new_password || "");

        if (!userId) {
          return Response.json({
            ok: false,
            message: "회원 정보가 없습니다."
          }, { status: 400 });
        }

        if (newPassword.length < 8) {
          return Response.json({
            ok: false,
            message: "새 비밀번호는 8자 이상 입력해주세요."
          }, { status: 400 });
        }

        if (newPassword.length > 72) {
          return Response.json({
            ok: false,
            message: "새 비밀번호는 72자 이하로 입력해주세요."
          }, { status: 400 });
        }

        const { error } =
          await ctx.supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: newPassword }
          );

        if (error) {
          console.error(
            "admin-member-password-reset update error:",
            error.message
          );

          return Response.json({
            ok: false,
            message: "비밀번호를 변경하지 못했습니다."
          }, { status: 500 });
        }

        console.info(
          "admin-member-password-reset success",
          { userId }
        );

        return Response.json({
          ok: true,
          message: "회원 비밀번호가 변경되었습니다."
        });
      } catch (error) {
        console.error(
          "admin-member-password-reset error:",
          error
        );

        return Response.json({
          ok: false,
          message: "비밀번호 변경 중 서버 오류가 발생했습니다."
        }, { status: 500 });
      }
    }
  )
};
