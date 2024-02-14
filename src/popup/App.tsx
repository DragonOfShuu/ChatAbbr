import './App.sass';
import gear from './gear.svg';

function App() {
  return (
    <div className="App">
      ChatAbbr
      <div className="flex flex-row">
        <img src={gear} alt='Settings' width={50} height={50} />
      </div>
    </div>
  );
}

export default App;
