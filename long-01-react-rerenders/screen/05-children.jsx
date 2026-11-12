import { Panel, ProductTable, useScrollY } from "./_ui";
// screen:start app
function App() {
  return (
    <ScrollPanel>
      <ProductTable />
    </ScrollPanel>
  );
}
function ScrollPanel({ children }) {
  const y = useScrollY();
  return (
    <Panel y={y}>{children}</Panel>
  );
}
// screen:end
export default App;
