import { useEffect } from "react";

import { LayoutPage } from "lib/types";

import SplashLayout from "layouts/splash-layout";

const LoginIndexPage: LayoutPage = () => {
  useEffect(() => {
    const loginUrl = new URL("https://id.twitch.tv/oauth2/authorize");
    const redirectUrl = new URL("/login/callback", location.href);

    loginUrl.searchParams.set("client_id", process.env.CLIENT_ID as string);
    loginUrl.searchParams.set("redirect_uri", redirectUrl.toString());
    loginUrl.searchParams.set("response_type", "token");
    loginUrl.searchParams.set("scope", "chat:read");

    location.assign(loginUrl.toString());
  });

  return <>Redirecting to Twitch...</>;
};

LoginIndexPage.Layout = SplashLayout;

export default LoginIndexPage;
