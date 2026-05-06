"use client";

import { useState } from "react";

export default function Home() {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [requiredAttendance, setRequiredAttendance] = useState("75");

  const total = Number(totalClasses);
  const attended = Number(attendedClasses);
  const required = Number(requiredAttendance);

  const attendance =
  total > 0 ? (attended / total) * 100 : 0;

  let classesCanMiss = 0;
  let classesNeeded = 0;

  if (attendance >= required) {
    while (((attended / (total + classesCanMiss)) * 100) >= required) {
      classesCanMiss++;
    }

    classesCanMiss--;
  } else {
    while (
      (((attended + classesNeeded) / (total + classesNeeded)) * 100) <
      required
    ) {
      classesNeeded++;
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[420px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Attendance Calculator
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Total Classes"
            value={totalClasses}
            onChange={(e) => setTotalClasses(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Attended Classes"
            value={attendedClasses}
            onChange={(e) => setAttendedClasses(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Required Attendance %"
            value={requiredAttendance}
            onChange={(e) => setRequiredAttendance(e.target.value)}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-xl font-semibold">
            Current Attendance: {attendance.toFixed(2)}%
          </p>

          {attendance >= required ? (
            <p className="text-green-600 font-medium">
              You can miss {classesCanMiss} more classes.
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              You need to attend {classesNeeded} consecutive classes.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}