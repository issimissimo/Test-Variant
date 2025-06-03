function Game(props) {

    return (
        <div>
            <h2>
                {props.marker.name}
            </h2>
            <p>
                {JSON.stringify(props.jsonData)}
            </p>
        </div>
    )
}
export default Game