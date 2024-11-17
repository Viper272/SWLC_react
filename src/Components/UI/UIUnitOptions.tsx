import { Sector } from "../../Types/SectorTypes";

interface Props {
    currSector: Sector;
    uiButtonHeight?: number;
    uiButtonWidth?: number;
}
const defaultProps = {
    uiButtonHeight: 15,
    uiButtonWidth: 45,
} satisfies Partial<Props>;

export default function UIUnitOptions(props: Props) {

    const propsWithDefaults = {
        ...defaultProps,
        ...props,
    }
    const {currSector, uiButtonHeight, uiButtonWidth} = propsWithDefaults;

    const UIPosX = currSector.position.X// - (uiButtonWidth/2);
    const UIPosY = currSector.position.Y// - (uiButtonHeight/2);

    return (
        <g id="UnitMoveOptions" transform={`translate (${UIPosX} ${UIPosY})`}>
            {renderActions(uiButtonWidth,  uiButtonHeight)}
        </g>
    );
}

const unitActions = [
    "UI Action 1",
    "UI Action 2",
    "UI Action 3",
    "UI Action 4",
    "UI Action 5",
];
const UIInitialAngle = -90;
const UIRadius = 45;
const UIFontSize = 7;
function renderActions(UIWidth: number, UIHeight: number) {

    const increase = Math.PI * 2 / unitActions.length;
    //Angle must be in Radians
    let angle = UIInitialAngle * (Math.PI/180);
    let radius = UIRadius; 

    return unitActions.map((item, index) => {
        
        angle += increase;

        let xPos = radius * Math.cos(angle) - (UIWidth / 2);
        let yPos = radius/2 * Math.sin(angle) - (UIHeight / 2);

        return ( 
            <svg key={index} x={xPos} y={yPos}
                width={UIWidth} height={UIHeight}>
                <rect width="100%" height="100%" fill="cyan" stroke="black" rx={5} ry={5}/>
                <text x="50%" y="50%" fontSize={UIFontSize}
                    dominantBaseline="central" textAnchor="middle">
                    {item}
                </text>
            </svg>
        )
    })
}

