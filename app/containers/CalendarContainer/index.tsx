import React from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarSidebar } from "./components/CalendarSidebar";
import { Calendar } from "./components/Calendar";

const CalendarContainer = () => {
  return (
    <div className="flex flex-column">
      <CalendarHeader />
      <div className="flex">
        <CalendarSidebar />
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarContainer;
