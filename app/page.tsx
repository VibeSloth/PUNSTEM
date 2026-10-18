import { redirect } from "next/navigation";

export default function Home() {
  // Use a top-level page so sign-in cookies are not established in an iframe.
  redirect("/account.html");
}
