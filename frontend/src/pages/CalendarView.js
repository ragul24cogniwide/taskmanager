import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarView.css";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNoteInput(notes[date.toDateString()] || "");
  };

  const handleNoteSave = () => {
    setNotes({ ...notes, [selectedDate.toDateString()]: noteInput });
    alert("Note saved!");
  };

  return (
    <div className="calendar-container">
      <h2>📅 Calendar View</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="custom-calendar"
      />

      <div className="note-section">
        <h3>Note for {selectedDate.toDateString()}</h3>
        <textarea
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Write your note here..."
        />
        <button onClick={handleNoteSave}>Save Note</button>
      </div>
    </div>
  );
};

export default CalendarView;
