
type SvgButtonProps = {
    onClick: (e: React.MouseEvent)=> any,
    className?: string,
    svgClassName?: string,
    image: SVGRType,
    width?: number,
    height?: number,
    scale?: number,
}

const SvgButton = (props: SvgButtonProps) => {
    const defaultSize = 40
    const width = props.scale??props.width??defaultSize
    const height = props.scale??props.height??defaultSize

    return (
        <button className={`${props.className} bg-opacity-0`}>
            <props.image 
                width={width} 
                height={height} 
                strokeWidth={2} 
                className={`${props.svgClassName??''} stroke-black hover:stroke-gray-800`} 
                onClick={props.onClick} />
        </button>
    )
}

export default SvgButton;
