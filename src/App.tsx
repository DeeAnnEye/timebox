import { useEffect, useState } from "react";
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
  const [date, setDate] = useState<any>("");
  const [reminder, setReminder] = useState("");
  const [calendarGrid, setCalendarGrid] = useState<any>([]);
  const todayISO = new Date().toISOString().split("T")[0];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    getCalendarGrid();
  }, []);

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

    setCalendarGrid(dates);
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

  type ReminderMap = Record<string, string>;

  const saveReminder = () => {
    const raw = localStorage.getItem("reminders");
    const data: ReminderMap = raw ? JSON.parse(raw) : {};

    data[date] = reminder;

    localStorage.setItem("reminders", JSON.stringify(data));
    getCalendarGrid();
  };

  const getReminder = (date: string): string => {
    const raw = localStorage.getItem("reminders");
    const data: ReminderMap = raw ? JSON.parse(raw) : {};

    return data[date] || "";
  };

  const handleDateClick = (sdate: any) => {
    if (date === sdate) {
      setDate("");
      return;
    }
    setDate(sdate);
    const rm = getReminder(sdate);
    setReminder(rm);
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
          {weekdays.map((day, index) => (
            <div key={index} className="cal-header-item">
              {day.toUpperCase()}
            </div>
          ))}
        </div>
        <div className="calendar">
          {calendarGrid.map((item: any, index: any) => {
            if (!item) {
              return <div key={index} className="cell empty" />;
            }

            return (
              <div
                key={index}
                className={`cell ${
                  item.date === todayISO
                    ? "today"
                    : date === item.date
                    ? "cell-selected"
                    : ""
                }`}
                onClick={() => handleDateClick(item.date)}
              >
                {item.day}
                {getReminder(item.date).length > 0 && <span className="dot" />}
              </div>
            );
          })}
        </div>
        {date && (
          <div className="reminder">
            <textarea
              className="reminder-textarea"
              cols={50}
              rows={3}
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
            <button className="reminder-btn" onClick={() => saveReminder()}>
              SAVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
