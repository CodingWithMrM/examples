# Technical Verification & Benchmarks: Stop Using useEffect

## 1. Official Documentation Reference
- **Source:** React official documentation (`react.dev`)
- **Chapter:** *Escape Hatches* → *"You Might Not Need an Effect"*
- **URL:** [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)
- **Core Rule Cited on Screen:**
  > *"When something can be calculated from the existing props or state, don’t put it in state. Instead, calculate it during rendering."*
  > *"To reset entire component state when a prop changes, pass a different key to it."*

---

## 2. Tested Code Samples & Render Verification
All code samples compiled with `esbuild` and rendered to string with `react-dom/server` via `scripts/check-samples.mjs`:
- `videos/shorts/01-stop-useeffect/code/src/SearchList-bug.jsx` (PASS)
- `videos/shorts/01-stop-useeffect/code/src/SearchList-fix.jsx` (PASS)
- `videos/shorts/01-stop-useeffect/code/src/KeyReset-fix.jsx` (PASS)

Tested Environment:
- **React:** 19.3.0
- **Node:** v20+ / macOS Darwin arm64

---

## 3. The Technical Mechanism (Cause → Effect → Fix)

### The Bug (Anti-Pattern)
```jsx
function SearchList({ items }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter(i => i.active));
  }, [items]);

  return <List items={filtered} />;
}
```
**Why this hurts:**
1. **Render 1:** Component renders with `filtered = []` (stale data). React commits and paints the DOM.
2. **Effect Run:** React browser paint finishes; `useEffect` runs asynchronously.
3. **Render 2:** `setFiltered(...)` queues an immediate second render pass. React re-executes `SearchList` and re-renders child components.
4. **Performance Penalty:**
   - 2 full render passes instead of 1.
   - Screen flicker / layout shift visible on slower mobile devices.
   - Infinite loop vulnerability: If a dependency is an object/array recreated in the parent without memoization, this triggers `Maximum update depth exceeded`.

---

### The Fix (Derived State During Render)
```jsx
function SearchList({ items }) {
  // Calculated during render (0 extra renders):
  const filtered = items.filter(i => i.active);

  return <List items={filtered} />;
}
```
**Why this is strictly superior:**
1. **0 Extra Renders:** Exactly 1 render pass.
2. **Instant Execution:** Filtering 1,000 items takes $< 0.1\text{ms}$ in JavaScript.
3. **Mathematically Impossible to Desync:** `filtered` is always in lockstep with the received `items` prop.

---

### Form Reset Fix (Key Prop)
```jsx
// Resetting state when an ID changes?
// BAD: useEffect(() => resetForm(), [userId])
// GOOD:
<ProfileEditor key={userId} />
```
**Why this is strictly superior:**
- Passing a different `key` tells React that `ProfileEditor` for user A and user B are conceptually different components.
- React unmounts the old instance and mounts a fresh one with initial state automatically in the **same commit phase**, completely eliminating post-paint layout jumps.
