
type Props = {
    className: string
}

const AbbrSidebar = (props: Props) => {
    return (
        <div className={`${props.className??''} min-h-screen bg-fuchsia-300 fixed flex flex-col`}>
            <h1>
                ChatAbbr
            </h1>
            <div className={`h-8`} />
            <div className={`flex flex-col grow`}>

            </div>
            <div>
                <a href="https://dragonofshuu.dev/" target="_blank" rel="noopener noreferrer">
                    {`Made by Logan Cederlof`}
                </a>
            </div>
        </div>
    )
}

export default AbbrSidebar