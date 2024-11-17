import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3";

import {Sector} from "../../Types/SectorTypes"
import { MapSaveData, SectorConnectionData } from "../../Types/MapSaveData";
import rawJSON from '../../_data/mapData.json'
import colors from "../../Constants/colors";
import UIUnitOptions from "../UI/UIUnitOptions";


function LoadMapJSON(): MapSaveData {
    const mapdata: MapSaveData = new MapSaveData();
    mapdata.mapSize = rawJSON.mapSize;
    mapdata.sectors = rawJSON.sectors;
    mapdata.connections = rawJSON.connections;

    return mapdata;
}
export default function GCMap() {

    const zoomSVGRef = useRef<SVGSVGElement>(null)
    const [selectedSector, setSelectedSector] = useState<Sector>();

    const mapData: MapSaveData = LoadMapJSON();
    console.log(mapData);

    const mapSize = mapData.mapSize;
    const devices = {
        test: [1, 10],
        desktop: [1.6, 7]
    }
    const [zoomMin, zoomMax] = devices.desktop;

    const zoom = useMemo(() => { 
        return d3.zoom<SVGSVGElement, unknown>()
            .translateExtent([[0,0], [mapSize, mapSize]])
            .scaleExtent([zoomMin, zoomMax])
    }, []);
    useEffect(() => {
        function zoomed(e: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
            d3.select(zoomSVGRef.current).select("#zoomSVGG")
                .attr("transform", e.transform.toString());
        }
        if(zoomSVGRef.current) {
            zoom.on("zoom", zoomed)
            d3.select(zoomSVGRef.current).call(zoom);
            // call(zoom.transform, d3.zoomIdentity.translate());
        }
    }, [zoom, zoomSVGRef])


    const sectorData = mapData.sectors.map((sector, i) => {
        const res: Sector = {
            ID: sector.id,
            name: sector.name,
            abbr: sector.abbr,
            position: sector.position,
            unitIconPosition: sector.unitIconLocation,
        }
        return res;
    });
    const laneData: SectorConnectionData[] = mapData.connections;

    // #region mapDraw
    const delaunay = useMemo(() => {
        const data = sectorData.map<Delaunay.Point>((s) => [s.position.X, s.position.Y]);
        return Delaunay.from(data);
    }, []);
    const voronoi = useMemo(() => {
        return delaunay.voronoi([0, 0, mapSize, mapSize]);
    }, [sectorData]);

    const mapText = sectorData.map((s, i) => {
        return (
            <text 
                x={s.position.X}
                y={s.position.Y + 12}
                fontSize={6}
                textAnchor="middle"
            >
                {s.ID}
            </text>
        )
    })
    const fullMapData = sectorData.map((sector, i) => {

        const sectorVoronoiPath = voronoi.renderCell(i);

        const sectorLaneData = laneData.find(c => c.id === sector.ID)?.sectorIDs.map((conn, i) => {
            const sDest = sectorData[conn];
            return (
                <line
                    key={i}
                    id={`${sector.name}-${sDest.name}_Lane`}
                    x1={sector.position.X}
                    y1={sector.position.Y}
                    x2={sDest.position.X}
                    y2={sDest.position.Y}
                    stroke="white"
                    strokeWidth={1}
                />
            )
        });

        return(
            <g key={`${i}`} id={`Sector-${sector.ID}`} onClick={() => setSelectedSector(sector)}>
                {/* Sector Voronoi Area */}
                <path
                    d={sectorVoronoiPath}
                    stroke="black"
                    strokeWidth={1}
                    strokeOpacity={0.1}
                    opacity={1}
                    fill={"transparent"}
                />
                {/* Connected Sector Paths */}
                <g>
                    {sectorLaneData}
                </g>
                {/* Sector Planet Icon Location */}
                <circle 
                    r={5}
                    cx={sector.position.X}
                    cy={sector.position.Y}
                    opacity={1}
                    strokeWidth={1}
                />
                {/* <image preserveAspectRatio="xMinYMin" 
                    width={20}
                    x={sector.unitIconPosition.X-10}
                    y={sector.unitIconPosition.Y-10} 
                    href={"/Icons/Icon_CIS.svg"}
                /> */}
            </g>
        )
    })
    // #endregion

    return(
        <svg id="map" ref={zoomSVGRef} style={{height:"100%", width:"100%"}}>
            <g id="zoomSVGG">
                {selectedSector ?                 
                <path
                    d={voronoi.renderCell(selectedSector.ID)}
                    stroke="black"
                    strokeWidth={1}
                    strokeOpacity={1}
                    fill={colors.rebels.default}
                /> : null}
                {fullMapData}
                {mapText}
                {/* {selectedSector ? <UIUnitOptions currSector={selectedSector}/> : null} */}
            </g>
        </svg>
    )
}