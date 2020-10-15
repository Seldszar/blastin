import Head from "next/head";
import Link from "next/link";

import { LayoutPage } from "lib/types";

import Button from "components/button";

import styles from "./index.module.scss";

const IndexPage: LayoutPage = () => (
  <div className={styles.wrapper}>
    <Head>
      <title>Blastin for Twitch</title>
    </Head>

    <div className={styles.inner}>
      <svg className={styles.logo} viewBox="0 0 1041.05 200">
        <path d="M0,3.56H69.43c40.36,0,73,10.09,73,48.07,0,16.62-9.49,35.61-24.33,41.55v1.18c18.4,5.34,33.24,19.59,33.24,45.11,0,39.76-34.43,57-76,57H0ZM68.25,78.93c16.62,0,24.33-7.71,24.33-19.58S84.87,42.73,68.25,42.73H51v36.2Zm3.56,78.34c20.18,0,29.67-7.12,29.67-21.37S92,116.32,71.81,116.32H51v41Z" />
        <path d="M263.4,153.71l-12.62,42.73H181.59V3.56h51V153.71Z" />
        <path d="M446.44,196.44h-54l-20.18-84.27C366.92,91.69,363.36,71.81,358,51h-1.19c-5.34,20.77-9.2,40.65-14.24,61.13L323,196.44H270.78l57-192.88h61.72Z" />
        <path d="M450,172.4l29.08-35c13.65,11,30.86,18.69,45.1,18.69,15.43,0,22-5,22-13.65,0-9.2-9.79-12.16-26.11-18.69l-24-10.09c-20.77-8.31-38.87-25.82-38.87-53.71C457.11,27,486.79,0,528.92,0c22,0,46.29,8.31,64.09,25.81L567.5,57.86c-13.06-9.2-24.34-13.94-38.58-13.94-12.46,0-20.18,4.45-20.18,13,0,9.2,11,12.46,28.49,19.29l23.44,9.2c24,9.5,37.69,26.11,37.69,52.82,0,32.64-27.3,61.72-75.37,61.72C498.66,200,470.76,191.1,450,172.4Z" />
        <path d="M660.07,46.29H609V3.56H762.14V46.29h-51V196.44h-51Z" />
        <path d="M790.62,3.56h51V196.44h-51Z" />
        <path d="M884.37,3.56H936.6l42.73,86.05,18.39,43.33h1.19c-2.37-20.77-6.53-49.85-6.53-73.59V3.56h48.67V196.44H988.82l-42.73-86.35-18.39-43h-1.19c2.37,22,6.53,49.85,6.53,73.59v55.79H884.37Z" />
      </svg>

      <div className={styles.description}>
        <p>
          Yet another activity feed dashboard offering a high degree of customization with powerful
          filter expressions à la SQL
        </p>
      </div>

      <Link href="/login">
        <Button large>Login with Twitch</Button>
      </Link>
    </div>
  </div>
);

export default IndexPage;
