"use server";
// The server action: runs on the server, returns the name it got.
export async function serverAction(_prev: string | null, formData: FormData) {
  return String(formData.get("name") ?? "");
}
