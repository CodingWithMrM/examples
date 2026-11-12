import { Panel, ProductTable, useScrollY } from "./_ui";
// screen:start panel
function ScrollPanel() {
  const y = useScrollY();
  return (
    <Panel y={y}>
      <ProductTable />
    </Panel>
  );
}
// screen:end
export default ScrollPanel;
