import Head from "next/head";
import Link from "next/link";

import { RouterOutputs, api } from "~/utils/api";
import styles from "./index.module.css";

import { UserButton, SignInButton, useUser, useAuth } from "@clerk/nextjs";
import { LoadingSpinner } from "~/components/loading";


type PostWithUser = RouterOutputs["post"]['getAll'][number];
const PostView = (fullPost: PostWithUser) => {
  return (
    <li key={fullPost.post.id}> Post: {fullPost.post.content}  {fullPost.author?.username ? "Author: " + fullPost.author?.username : "-No-Author-defined-"}</li>
  )
}


export default function Home() {
  const { data, isLoading } = api.post.getAll.useQuery();
  const user = useUser();
  const auth = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Something went wrong.</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Simple t3 App with clerk
          </h1>

          <div className={styles.cardRow}>
            <div className={styles.card}>
              {auth.isSignedIn
                ? <UserButton afterSignOutUrl="/" />
                : <><Link href="/sign-in">LOGIN</Link>
                  <SignInButton /></>
              }
              <p>Auth data</p>
              <pre>{JSON.stringify(auth, null, 2)}</pre>
            </div>
          </div>

          <ul className={styles.showcaseText}>
            {data?.map(fullPost => <PostView {...fullPost} key={fullPost.post.id} />)}
          </ul>


          <div className={styles.cardRow}>
            <div className={styles.card}>
              <p>User data</p>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
