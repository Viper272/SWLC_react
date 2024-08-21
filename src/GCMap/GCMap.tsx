import "./GCMap.css"
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3";

import mapData from "../_data/mapdata.json"
import colors from "../Constants/colors";

export default function GCMap() {

    const zoomSVGRef = useRef<SVGSVGElement>(null)

    const [selectedSector, setSelectedSector] = useState(-1);

    const mapSize = mapData.mapSize;
    const xScale = d3.scaleLinear().domain([0, mapSize]).range([0, mapSize]);
    const yScale = d3.scaleLinear().domain([0, mapSize]).range([0, mapSize]);


    const zoom = useMemo(() => { 
        return d3.zoom<SVGSVGElement, unknown>()
            .translateExtent([[0,0], [mapSize, mapSize]])
            .scaleExtent([1, 3]);
    }, []);
    useEffect(() => {
        function zoomed(e: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
            d3.select(zoomSVGRef.current).select("#zoomSVGG")
                .attr("transform", e.transform.toString());
        }
        if(zoomSVGRef.current) {
            zoom.on("zoom", zoomed)
            d3.select<SVGSVGElement, unknown>(zoomSVGRef.current).call(zoom);
        }
    }, [zoom, zoomSVGRef])


    // #region mapDraw
    const sectorData = Object.values(mapData.sectors);
    const laneData = Object.values(mapData.connections);

    const delaunay = useMemo(() => {
        const data = sectorData.map<Delaunay.Point>((s) => [s.position.x, s.position.y]);
        console.log(data);
        return Delaunay.from(data);
    }, []);
    const voronoi = useMemo(() => {
        return delaunay.voronoi([0, 0, mapSize, mapSize]);
    }, [sectorData]);
    
    const sectorPoints = sectorData.map((sector, i) => {
        return (
            <circle
                key={i}
                r={10} //Hard coded. Change
                cx={xScale(sector.position.x)}
                cy={yScale(sector.position.y)}
                opacity={1}
                strokeWidth={1}
                onClick={() => setSelectedSector(i)}
            />
        )
    });
    const sectorLanes = laneData.map((d, i) => {
        const sOrigin = sectorData[d.sectorID];
        const laneArr = d.connections.map((conn, i) => {
            const sDest = sectorData[conn];
            return (
                <line
                    id={`${sOrigin.name}-${sDest.name}_Lane`}
                    x1={sOrigin.position.x}
                    y1={sOrigin.position.y}
                    x2={sDest.position.x}
                    y2={sDest.position.y}
                    stroke="white"
                    strokeWidth={1}
                />
            )
        })  
        return laneArr;
    });
    const voronoiCells = sectorData.map((sector, i) => {
        const p = voronoi.renderCell(i);
        return (
            <path
                key={i}
                d={p}
                stroke="black"
                strokeWidth={1}
                strokeOpacity={0.1}
                opacity={i===selectedSector ? 1 : 1}
                fill={i===selectedSector ? colors.rebels.default : "transparent"}
                //fill={colors.rebels.default}
                onClick={() => setSelectedSector(i)}
            />
        )
    });
    // #endregion

    return(
        <div className="GCMap">
            <svg id="mapSVG" ref={zoomSVGRef} width={mapData.mapSize} height={mapData.mapSize} > 
                <g id="zoomSVGG">
                    {/*<path d={delaunay.render()} stroke="white" fill="transparent"/>*/}
                    {voronoiCells}
                    {sectorLanes}
                    {sectorPoints}
                </g>
            </svg>
        </div>
    )
}