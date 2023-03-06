import './App.css';
import CreateJsonFileButton from "./generator/CreateJsonFileButton";
import Calculator from "./components/Calculator";

function App() {
  return (
    <div className="App">
        <h1>Client Rewards Points Table <span>By Josh Fair</span></h1>
        <Calculator />
        <CreateJsonFileButton />
    </div>
  );
}

export default App;
