// The quiz cards: three trees as JSX. Which ProductTable re-renders when you type?
import { Panel, ProductTable } from "./_ui";
const App = ({ children }) => <>{children}</>;
const Input = () => <input />;
const SearchBox = () => <input />;
const ScrollPanel = ({ children }) => <Panel>{children}</Panel>;
export default function Quiz() {
  return (
    <>
      {/* screen:start a */}
      <App> {/* q lives in App */}
        <Input />
        <ProductTable />
      </App>
      {/* screen:end */}
      {/* screen:start b */}
      <App>
        <SearchBox /> {/* q lives here */}
        <ProductTable />
      </App>
      {/* screen:end */}
      {/* screen:start c */}
      <ScrollPanel> {/* y lives here */}
        <ProductTable />
      </ScrollPanel>
      {/* screen:end */}
    </>
  );
}
