"use client";

import { useState } from "react";

export default function Home() {
  const [plannedClasses, setPlannedClasses] = useState("");
  const [conductedClasses, setConductedClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [requiredAttendance, setRequiredAttendance] = useState("75");

  const planned = Number(plannedClasses);
  const conducted = Number(conductedClasses);
  const attended = Number(attendedClasses);
  const required = Number(requiredAttendance);

  const remainingClasses = planned - conducted;

  const currentAttendance =
    conducted > 0 ? (attended / conducted) * 100 : 0;

  const minimumAttendanceNeeded = Math.ceil(
    (required / 100) * planned
  );

  const futureClassesNeeded = Math.max(
    minimumAttendanceNeeded - attended,
    0
  );

  const maxClassesCanMiss = remainingClasses - futureClassesNeeded;

  const invalidInput =
    attended > conducted ||
    conducted > planned ||
    planned <= 0;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Attendance Calculator
        </h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 font-medium">
              Total Planned Classes
            </label>

            <input
              type="number"
              placeholder="e.g. 120"
              value={plannedClasses}
              onChange={(e) => setPlannedClasses(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Classes Conducted So Far
            </label>

            <input
              type="number"
              placeholder="e.g. 69"
              value={conductedClasses}
              onChange={(e) => setConductedClasses(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Classes Attended
            </label>

            <input
              type="number"
              placeholder="e.g. 55"
              value={attendedClasses}
              onChange={(e) => setAttendedClasses(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Required Attendance %
            </label>

            <input
              type="number"
              placeholder="75"
              value={requiredAttendance}
              onChange={(e) => setRequiredAttendance(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>
        </div>

        {!invalidInput ? (
          <div className="mt-8 space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Current Attendance:
              </p>

              <p className="text-2xl font-bold">
                {currentAttendance.toFixed(2)}%
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Remaining Classes:
              </p>

              <p className="text-2xl font-bold">
                {remainingClasses}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Minimum Future Classes You Must Attend:
              </p>

              <p className="text-2xl font-bold">
                {futureClassesNeeded}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Maximum Classes You Can Still Miss:
              </p>

              <p
                className={`text-2xl font-bold ${
                  maxClassesCanMiss < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {maxClassesCanMiss}
              </p>
            </div>

            {maxClassesCanMiss < 0 && (
              <p className="text-red-600 font-medium text-center">
                You cannot reach the required attendance anymore.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 bg-red-100 text-red-700 p-4 rounded-xl">
            Please check your inputs.
          </div>
        )}
      </div>
    </main>
  );
}