import { Provider } from "react-redux";
import "./App.css";
import { Toaster } from 'react-hot-toast';
import Home from "./Routes/Home";
import store from "./Redux/Store";


function App() {
  return (
    <Provider store={store}>
       <Toaster position="top-right" reverseOrder={false} />
      <Home />
    </Provider>
  );
}

export default App;
