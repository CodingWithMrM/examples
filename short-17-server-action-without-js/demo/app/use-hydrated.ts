"use client";
import { useSyncExternalStore } from "react";
// false on the server and during hydration, true once React has taken over in the browser
export const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);
