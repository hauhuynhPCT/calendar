// import {
//   addDays,
//   format,
//   startOfWeek,
//   addWeeks,
//   subWeeks,
//   isBefore,
//   isAfter,
// } from "date-fns";
// import { useState } from "react";
// import { CalendarIcon, X } from "lucide-react";
// import { Dialog, DialogContent } from "~/components/ui/dialog";

import CalendarContainer from "~/containers/CalendarContainer";

// type Event = {
//   name: string;
//   type: number;
//   from: string;
//   to: string;
//   createdAt: string;
// };

// type Position = Event & {
//   left: number;
//   width: number;
//   zIndex: number;
// };

// interface EventWithElement extends Event {
//   targetEl: HTMLElement;
// }

// const mockData: Event[] = [
//   {
//     name: "Simple #1",
//     type: 1,
//     from: "2025-04-09T08:00:00",
//     to: "2025-04-09T09:00:00",
//     createdAt: "2025-03-21T09:00:00",
//   },

//   // Full overlap
//   {
//     name: "Overlap #1",
//     type: 2,
//     from: "2025-04-09T10:00:00",
//     to: "2025-04-09T11:30:00",
//     createdAt: "2025-03-22T09:00:00",
//   },
//   {
//     name: "Overlap #2",
//     type: 3,
//     from: "2025-04-09T10:00:00",
//     to: "2025-04-09T11:30:00",
//     createdAt: "2025-03-23T09:00:00",
//   },

//   // Partial overlap
//   {
//     name: "Partial A",
//     type: 1,
//     from: "2025-04-09T11:00:00",
//     to: "2025-04-09T12:00:00",
//     createdAt: "2025-03-24T09:00:00",
//   },
//   {
//     name: "Partial B",
//     type: 2,
//     from: "2025-04-09T11:30:00",
//     to: "2025-04-09T12:30:00",
//     createdAt: "2025-03-24T09:10:00",
//   },

//   // Nesting
//   {
//     name: "Parent",
//     type: 3,
//     from: "2025-04-09T13:00:00",
//     to: "2025-04-09T15:00:00",
//     createdAt: "2025-03-25T09:00:00",
//   },
//   {
//     name: "Child A",
//     type: 1,
//     from: "2025-04-09T13:30:00",
//     to: "2025-04-09T14:00:00",
//     createdAt: "2025-03-25T09:10:00",
//   },
//   {
//     name: "Child B",
//     type: 2,
//     from: "2025-04-09T14:00:00",
//     to: "2025-04-09T14:30:00",
//     createdAt: "2025-03-25T09:20:00",
//   },

//   // Back-to-back
//   {
//     name: "Back-to-back A",
//     type: 1,
//     from: "2025-04-09T15:00:00",
//     to: "2025-04-09T15:30:00",
//     createdAt: "2025-03-26T09:00:00",
//   },
//   {
//     name: "Back-to-back B",
//     type: 1,
//     from: "2025-04-09T15:30:00",
//     to: "2025-04-09T16:00:00",
//     createdAt: "2025-03-26T09:01:00",
//   },

//   // Very short event
//   {
//     name: "Quick 5m",
//     type: 2,
//     from: "2025-04-09T17:00:00",
//     to: "2025-04-09T17:05:00",
//     createdAt: "2025-03-26T10:00:00",
//   },

//   // Multi-hour
//   {
//     name: "Long Meeting",
//     type: 3,
//     from: "2025-04-09T18:00:00",
//     to: "2025-04-09T21:00:00",
//     createdAt: "2025-03-26T11:00:00",
//   },

//   // Same start time, diff durations
//   {
//     name: "Same Start A",
//     type: 1,
//     from: "2025-04-09T22:00:00",
//     to: "2025-04-09T22:30:00",
//     createdAt: "2025-03-26T12:00:00",
//   },
//   {
//     name: "Same Start B",
//     type: 2,
//     from: "2025-04-09T22:00:00",
//     to: "2025-04-09T23:30:00",
//     createdAt: "2025-03-26T12:01:00",
//   },

//   // Near midnight
//   {
//     name: "Late Night",
//     type: 3,
//     from: "2025-04-09T23:45:00",
//     to: "2025-04-10T00:15:00",
//     createdAt: "2025-03-26T13:00:00",
//   },
//   //edge case
//   {
//     name: "left top",
//     type: 2,
//     from: "2025-04-07T01:00:00",
//     to: "2025-04-07T02:30:00",
//     createdAt: "2025-03-26T12:01:00",
//   },
//   {
//     name: "left bottom",
//     type: 2,
//     from: "2025-04-07T22:00:00",
//     to: "2025-04-07T23:30:00",
//     createdAt: "2025-03-26T12:01:00",
//   },
//   {
//     name: "right top",
//     type: 2,
//     from: "2025-04-13T01:00:00",
//     to: "2025-04-13T03:30:00",
//     createdAt: "2025-03-26T12:01:00",
//   },
//   {
//     name: "right bottom",
//     type: 2,
//     from: "2025-04-13T23:00:00",
//     to: "2025-04-13T24:00:00",
//     createdAt: "2025-03-26T12:01:00",
//   },
// ];

// const getOverlappingClusters = (events: Event[]) => {
//   const sorted = [...events].sort((a, b) => {
//     const aStart = new Date(a.from);
//     const bStart = new Date(b.from);
//     return (
//       aStart.getTime() - bStart.getTime() ||
//       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//   });

//   const clusters: any[] = [];

//   sorted.forEach((event) => {
//     let added = false;
//     for (let cluster of clusters) {
//       if (
//         cluster?.some(
//           (e: Event) =>
//             new Date(e?.from || "") < new Date(event.to) &&
//             new Date(event.from) < new Date(e?.to || "")
//         )
//       ) {
//         cluster?.push(event);
//         added = true;
//         break;
//       }
//     }
//     if (!added) clusters.push([event]);
//   });

//   return clusters;
// };

// const assignLayout = (cluster: Event[]) => {
//   const positioned: Position[] = [];
//   cluster.forEach((event) => {
//     const overlapping = positioned.filter(
//       (e) =>
//         new Date(e.from) < new Date(event.to) &&
//         new Date(event.from) < new Date(e.to)
//     );
//     const left = overlapping.length * 25;
//     const width = 75 - overlapping.length * 5;
//     const zIndex = overlapping.length + 1;
//     positioned.push({ ...event, left, width, zIndex });
//   });
//   return positioned;
// };

// export default function Calendar() {
//   const [currentWeekStart, setCurrentWeekStart] = useState(
//     startOfWeek(new Date(), { weekStartsOn: 1 })
//   );
//   const [selectedEvent, setSelectedEvent] = useState<EventWithElement | null>(
//     null
//   );

//   const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
//   const days = Array.from({ length: 7 }).map((_, index) =>
//     addDays(currentWeekStart, index)
//   );

//   const handleNextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
//   const handlePrevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
//   const closeModal = () => setSelectedEvent(null);
//   const handleEventClick = (event: Event, targetEl: HTMLElement) => {
//     setSelectedEvent({ ...event, targetEl });
//   };

//   const colorMap = {
//     1: "#4B99D2",
//     2: "#F55E57",
//     3: "#489160",
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto">
//       {/* Navigation */}
//       <div className="flex justify-between items-center px-4 py-2 mb-2">
//         <button
//           onClick={handlePrevWeek}
//           className="text-sm px-3 py-1 rounded bg-muted hover:bg-muted/50 transition"
//         >
//           ⬅️ Previous
//         </button>
//         <h2 className="text-xl font-semibold">
//           {format(currentWeekStart, "MMM d")} –{" "}
//           {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
//         </h2>
//         <button
//           onClick={handleNextWeek}
//           className="text-sm px-3 py-1 rounded bg-muted hover:bg-muted/50 transition"
//         >
//           Next ➡️
//         </button>
//       </div>

//       {/* Modal */}
//       <Dialog
//         open={!!selectedEvent}
//         onOpenChange={(open) => !open && closeModal()}
//       >
//         <DialogContent
//           // className="fixed left-1/2 top-1/2 z-50 p-4 sm:p-6 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-xl shadow-xl transition-opacity duration-200 ease-in-out data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
//           style={(() => {
//             if (!selectedEvent?.targetEl || window.innerWidth < 640) return {};

//             const rect = selectedEvent.targetEl.getBoundingClientRect();
//             const modalWidth = 300;
//             const margin = 12;

//             const fitsRight =
//               rect.right + modalWidth + margin < window.innerWidth;
//             const left = fitsRight
//               ? rect.right + margin
//               : rect.left - modalWidth - margin;
//             const top = Math.max(
//               8,
//               Math.min(rect.top, window.innerHeight - 220)
//             );

//             return {
//               // position: "fixed",
//               // width: `${modalWidth}px`,
//               // left: `${left}px`,
//               // top: `${top}px`,
//               // transform: "none",
//             };
//           })()}
//         >
//           <h3 className="text-lg font-bold mb-2">{selectedEvent?.name}</h3>
//           <p className="text-sm mb-1">
//             <strong>From:</strong>{" "}
//             {selectedEvent?.from
//               ? format(new Date(selectedEvent.from), "PPpp")
//               : "N/A"}
//           </p>
//           <p className="text-sm mb-1">
//             <strong>To:</strong>{" "}
//             {selectedEvent?.to
//               ? format(new Date(selectedEvent.to), "PPpp")
//               : "N/A"}
//           </p>
//           <p className="text-sm">
//             <strong>Created At:</strong>{" "}
//             {selectedEvent?.createdAt
//               ? format(new Date(selectedEvent.createdAt), "PPpp")
//               : "N/A"}
//           </p>
//         </DialogContent>
//       </Dialog>

//       {/* Header */}
//       <div className="grid grid-cols-[56px_repeat(7,1fr)] text-sm font-medium">
//         <div className="bg-background px-2 py-2 text-muted-foreground text-xs">
//           &nbsp;
//         </div>
//         {days.map((day) => (
//           <div
//             key={day.toISOString()}
//             className="text-center py-2 border-l border-[#333537] bg-background"
//           >
//             <div className="uppercase text-[11px] text-[#c4c7c5] font-medium leading-[32px]">
//               {format(day, "EEE")}
//             </div>
//             <div className="text-[26px] leading-[46px] text-[#e3e3e3]">
//               {format(day, "dd")}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Calendar grid */}
//       <div className="grid grid-cols-[56px_repeat(7,1fr)] divide-x overflow-auto">
//         {/* Time Labels */}
//         <div className="flex flex-col text-xs text-muted-foreground">
//           {hours.map((hour) => (
//             <div key={hour} className="h-12 px-2 pt-1 text-right">
//               <span className="text-[#c4c7c5] text-[11px] font-medium leading-4">
//                 {hour}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Events per day */}
//         {days.map((day) => {
//           const dayStart = day;
//           const dayEnd = addDays(day, 1);
//           const dayEvents = mockData.filter((e) => {
//             const start = new Date(e.from);
//             const end = new Date(e.to);
//             return start < dayEnd && end > dayStart;
//           });

//           const clusters = getOverlappingClusters(dayEvents);

//           return (
//             <div
//               key={day.toISOString()}
//               className="relative h-full w-full border-l border-[#333537]"
//             >
//               {Array.from({ length: 24 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-12 border-t border-[#333537] border-muted hover:bg-muted/50 transition"
//                 />
//               ))}

//               {clusters.map((cluster) => {
//                 const positioned = assignLayout(cluster);
//                 return positioned.map((event) => {
//                   const start = new Date(event.from);
//                   const end = new Date(event.to);

//                   const displayStart = isBefore(start, dayStart)
//                     ? dayStart
//                     : start;
//                   const displayEnd = isAfter(end, dayEnd) ? dayEnd : end;

//                   const top =
//                     (displayStart.getHours() * 60 + displayStart.getMinutes()) *
//                     (48 / 60);
//                   const height =
//                     ((displayEnd.getTime() - displayStart.getTime()) / 60000) *
//                     (48 / 60);

//                   return (
//                     <div
//                       key={event.name + event.createdAt}
//                       className="absolute"
//                       style={{
//                         top,
//                         height,
//                         left: `${event.left}px`,
//                         width: `${event.width}%`,
//                         zIndex: event.zIndex,
//                       }}
//                       onClick={(e) => handleEventClick(event, e.currentTarget)}
//                     >
//                       <div
//                         className="text-xs text-white p-1 rounded-md shadow-md h-full overflow-hidden flex items-start gap-1 border border-white/20 shadow-lg"
//                         style={{
//                           backgroundColor: colorMap[event.type as 1 | 2 | 3],
//                         }}
//                       >
//                         <CalendarIcon className="w-3 h-3 mt-[2px] shrink-0" />
//                         <span className="truncate font-medium leading-tight">
//                           {event.name}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 });
//               })}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

const CalendarApp = () => <CalendarContainer />;
