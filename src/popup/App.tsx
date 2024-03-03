import './App.sass';
import Gear from './gear.svg';

function App() {
    const onSettingsClick = () => {
        chrome.tabs.create( { url: chrome.runtime.getURL('js/pages.html') } )
    }

    return (
        <div className="App">
            Paradigm
            <div className="flex flex-row">
                {/* <img src={Gear} alt='Settings' width={50} height={50} onClick={onSettingsClick} /> */}
                <Gear width={50} height={50} onClick={onSettingsClick} />
            </div>
        </div>
    );
}

export default App;
