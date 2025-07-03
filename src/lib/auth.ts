import { supabase } from "./supabase";

export function signIn() {
  return supabase.auth.signInWithOAuth({
    provider: "slack_oidc",
  })
}

export function getUser() {
  return supabase.auth.getUser();
}
