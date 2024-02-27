import './App.sass';
import gear from './gear.svg';

function App() {
    const onSettingsClick = () => {
        chrome.tabs.create( { url: chrome.runtime.getURL('js/pages.html') } )
    }

    return (
        <div className="App">
            Paradigm
            <div className="flex flex-row">
                <img src={gear} alt='Settings' width={50} height={50} onClick={onSettingsClick} />
            </div>
        </div>
    );
}

export default App;
