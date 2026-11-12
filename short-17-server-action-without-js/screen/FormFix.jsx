// Exactly the code shown on screen, plus tiny stand-ins (a fake server action and useHydrated) so check-samples can compile and render it.
// The real, measured version is in ../demo (Next.js 16.1.1, React 19.2.3).
import { useActionState, useOptimistic, useSyncExternalStore } from "react";

const serverAction = async (_prev, formData) => String(formData.get("name"));
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);

export function Form() {
  const [state_, action] = useActionState(serverAction, null);
  const [state, setOptimistic] = useOptimistic(state_);

  const enhanced = (formData) => {
    setOptimistic(formData.get("name"));
    action(formData);
  };

  const hydrated = useHydrated();

  return (
    <form action={hydrated ? enhanced : action}>
      <input name="name" defaultValue="Ada" />
      <button type="submit">Submit</button>
      <p>{state ? `Hello, ${state}` : "nothing yet"}</p>
    </form>
  );
}

export default function Demo() {
  return <Form />;
}
