import Orders from "./pages/orders";
import PageFrame from "./frames/pageFrame";
import WebsocketProvider from "./contexts/Websocket";

function App() {
  return (
    <div className="App">
      <PageFrame>
        <WebsocketProvider>
          <Orders />
        </WebsocketProvider>
      </PageFrame>
    </div>
  );
}

export default App;
