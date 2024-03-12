type SvgButtonProps = {
    onClick: (e: React.MouseEvent)=> any,
    className?: string,
    svgClassName?: string,
    strokeClasses?: string,
    image: SVGRType,
    width?: number,
    height?: number,
    scale?: number,
    strokeWidth?: number,
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
                strokeWidth={props.strokeWidth??2} 
                className={`${props.svgClassName??''} ${props.strokeClasses??'stroke-black hover:stroke-rose-600'}`} 
                onClick={props.onClick} />
        </button>
    )
}

export default SvgButton;
