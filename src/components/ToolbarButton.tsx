

export const ToolbarButton = (
    props: { 
        onClick: () => any, 
        Image: SVGRType, 
        disabled?: boolean, 
        alt: string, 
        className?: string, 
        imageClassName?: string,
        width?: number,
        height?: number,
        scale?: number
    }) => {
        const defaultSize = 32
        const width = props.scale??props.width??defaultSize
        const height = props.scale??props.height??defaultSize

        return (
            <button className={`p-1`} disabled={props.disabled} onClick={props.onClick}>
                <props.Image width={width} height={height} stroke="#ffffff" />
            </button>
        );
};
