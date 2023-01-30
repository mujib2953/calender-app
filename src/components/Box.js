const Box = ({ value = "", className = "", events = [] }) => {


    const elipsesName = (str) => {
        const MAX_WORD = 8;
        return str.length < MAX_WORD ? str : str.slice(0, MAX_WORD) + " ...";
    }

    const getEvents = () => {
        if (!events.length)
            return [];

        return events.map((item, index) => <div key={"event_" + item + "_" + index} className="event" title={item} >{elipsesName(item)}</div>)
    };

    if (className === "date") {
        return (
            <div className={`box ${className}`}>
                <div>
                    {value}
                </div>
                <div className="events">
                    {
                        getEvents()
                    }
                </div>
            </div>
        );
    }

    return (
        <div className={`box ${className}`}>
            {value}
        </div>
    );
}

export default Box;
