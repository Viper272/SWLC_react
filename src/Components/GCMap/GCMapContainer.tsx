import "./GCMapContainer.css";
import GCMap from "./GCMap";

function GCMapContainer() {

    return (
        <div className="MapContainer">
            <div className="Map">
                <GCMap/>
            </div>
            <div className="SectorInfo">
                Sector Info

                {/* <iframe src="https://tabletopadmiral.com/" height="100%" width="100%"/> */}
            </div>
        </div>
    );
}

export default GCMapContainer;