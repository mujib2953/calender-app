import { useEffect, useState } from "react";
import Box from "./Box";

const Calendar = () => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const countries = [
        { code: "us", name: "United States" },
        { code: "uk", name: "United Kingdom" },
        { code: "ca", name: "Canada" },
        { code: "in", name: "India" },

    ];
    const nRows = 6;
    const nCols = days.length;
    let startYear = 2020;
    const numberOfYear = 11; // --- means 10 values starting from 2020 (startYear variable)

    startYear--; // adjusting wrt year dropdown

    const [dropDownState, setDropDownState] = useState({
        month: "1",
        year: "2020",
        country: "in"
    });

    const [holidayList, setHolidayList] = useState({});

    const getCalender = () => {
        const _cal = [];
        const _date = new Date(`${dropDownState.year}-${Number(dropDownState.month) + 1}-01`);
        const dayOffset = _date.getDay();
        const maxDaysInMonth = new Date(dropDownState.year, Number(dropDownState.month) + 1, 0).getDate();
        let date = 1;

        for (let i = 0; i < nRows; i++) {
            _cal[i] = [];
            let kStart = 0;

            // --- logic for empty boxes
            if (i === 0 && dayOffset !== 0) {
                for (let j = 0; j < dayOffset; j++) {
                    _cal[i].push(<Box key={"empty_" + j} className="empty" />);
                }

                kStart = dayOffset;
            }

            for (let k = kStart; k < nCols; k++) {

                if (date > maxDaysInMonth)
                    break;

                const _events = (holidayList[date]) ? holidayList[date] : [];
                _cal[i].push(<Box key={"date_" + date} className="date" value={date} events={_events} />);

                date++;
            }
        }
        return _cal;
    };

    const getWeekName = () => {
        return days.map(item => <Box key={"weekname_" + item} className="week" value={item} />)
    };

    const updateDropDownState = (key, value) => {
        setDropDownState({
            ...dropDownState,
            [key]: value,
        });
    };

    const getHolidayList = async () => {

        const { country, month, year } = dropDownState;

        const resp = await fetch(`https://holidays.abstractapi.com/v1/?api_key=bf4c6a736f0f4f7dae929adcefbc322f&country=${country.toUpperCase()}&year=${year}&month=${Number(month) + 1}`)
        const holidays = await resp.json();

        const holidayByDate = {};
        for (let i = 0; i < holidays.length; i++) {

            if (holidayByDate[holidays[i].date_day]) {
                holidayByDate[holidays[i].date_day].push(holidays[i].name)
            }
            else {
                holidayByDate[holidays[i].date_day] = [holidays[i].name];
            }
        }
        setHolidayList(holidayByDate);
    };

    useEffect(() => {
        getHolidayList();
    }, [dropDownState]);

    return (
        <>
            <div className="calendar">
                <h4 className="note">Note: Disabling year dropdown, as abstract apis free plan only support year 2020.</h4>
                <div className="dropdown-container">
                    {/* months dropdown */}
                    <select
                        onChange={({ target: { value } }) => updateDropDownState("month", value)}
                        value={dropDownState.month}
                    >
                        {
                            months.map((item, index) => <option key={"month_" + index} value={index} >{item}</option>)
                        }
                    </select>

                    {/* years dropdown */}
                    <select
                        onChange={({ target: { value } }) => updateDropDownState("year", value)}
                        value={dropDownState.year}
                        disabled
                    >
                        {
                            Array(numberOfYear)
                                .fill("")
                                .map(item => { startYear++; return startYear })
                                .map((item, index) => <option key={"year_" + index} value={item} >{item}</option>)
                        }
                    </select>

                    {/* countries dropdown */}
                    <select
                        value={dropDownState.country}
                        onChange={({ target: { value } }) => updateDropDownState("country", value)}
                    >
                        {
                            countries.map(item => <option key={"country_" + item.code} value={item.code}>{item.name}</option>)
                        }
                    </select>
                </div>
                <div className="weekname-container">
                    {getWeekName()}
                </div>
                <div className="dates-container">
                    {getCalender()}
                </div>
            </div>
        </>
    );
};

export default Calendar;
