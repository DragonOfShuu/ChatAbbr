import SvgButton from '@/components/SvgButton';
import './App.sass';
import Gear from '@/icons/gear.svg';

function App() {
    const onSettingsClick = () => {
        chrome.tabs.create( { url: chrome.runtime.getURL('js/pages.html') } )
    }

    return (
        <div className="App">
            Paradigm
            <div className="flex flex-row">
                {/* <img src={Gear} alt='Settings' width={50} height={50} onClick={onSettingsClick} /> */}
                <SvgButton scale={50} image={Gear} onClick={onSettingsClick} />
            </div>
        </div>
    );
}

export default App;
