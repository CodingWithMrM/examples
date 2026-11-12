"use client";
import { useActionState, useOptimistic } from "react";
import { serverAction } from "../actions";
import { useHydrated } from "../use-hydrated";

export function Form() {
  const [state_, action, loading] = useActionState(serverAction, null);
  const [state, setOptimistic] = useOptimistic(state_);
  const enhanced = (formData: FormData) => {
    setOptimistic(formData.get("name") as string);
    action(formData);
  };
  const hydrated = useHydrated();
  return (
    <form action={hydrated ? enhanced : action}>
      <input name="name" defaultValue="Ada" />
      <button type="submit">{loading ? "Loading" : "Submit"}</button>
      <p id="out">{state ? `Hello, ${state}` : "nothing yet"}</p>
    </form>
  );
}
