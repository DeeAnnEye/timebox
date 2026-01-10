import { useState } from "react";
import "./App.css";
import moment from "moment";
import Header from "./Header";

const now = new Date();
const DATE = now.getDate();
const MONTH = now.getMonth() + 1;
const YEAR = now.getFullYear();

function App() {
  const [year, setYear] = useState(YEAR);
  const [month, setMonth] = useState(MONTH);
  const [date, setDate] = useState<any>(DATE);
  const [reminder, setReminder] = useState("");
  const todayISO = new Date().toISOString().split("T")[0];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getCalendarGrid = () => {
    const dates = [];
    const firstDay = new Date(year, month - 1, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push({
        day,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`,
      });
    }

    return dates;
  };

  const handleMonth = (type: any) => {
    if (type === "next") {
      if (month === 12) {
        setYear(year + 1);
        setMonth(1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 1) {
        setYear(year - 1);
        setMonth(12);
      } else {
        setMonth(month - 1);
      }
    }
    getCalendarGrid();
  };
  type ReminderMap = Record<string, string[]>;

  const saveReminder = () => {
    const raw = localStorage.getItem("reminders");
    const data: ReminderMap = raw ? JSON.parse(raw) : {};

    data[date] = data[date] || [];
    data[date].push(reminder);
    console.log(data,"DATA")
    localStorage.setItem("reminders", JSON.stringify(data));
  };

  const getReminders = (date: any): string[] => {
    const raw = localStorage.getItem("reminders");
    const data: ReminderMap = raw ? JSON.parse(raw) : {};

    return data[date] || [];
  };

  return (
    <div>
      <Header />
      <div className="content">
        <div className="month-row">
          <button onClick={() => handleMonth("prev")}>{"\u276E"}</button>
          <div className="cal-month">
            {moment()
              .month(month - 1)
              .format("MMMM")
              ?.toUpperCase()}{" "}
            {year}
          </div>
          <button onClick={() => handleMonth("next")}>{"\u276F"}</button>
        </div>
        <div className="cal-header">
          {weekdays.map((day) => (
            <div className="cal-header-item">{day.toUpperCase()}</div>
          ))}
        </div>
        <div className="calendar">
          {getCalendarGrid().map((item, index) => (
            <div
              key={index}
              className={`cell ${item?.date === todayISO ? "today" : ""}`}
              onClick={()=>setDate(item?.date)}
            >
              {item ? item.day : ""}
              {/* {getReminders(item?.date).length > 0 && <span className="dot" />} */}
            </div>
          ))}
        </div>
        {/* <div className="reminder">
          <textarea cols={50} rows={4} onChange={(e)=>setReminder(e.target.value)} />
          <button onClick={() => saveReminder()}>SAVE</button>
        </div> */}
      </div>
    </div>
  );
}

export default App;
