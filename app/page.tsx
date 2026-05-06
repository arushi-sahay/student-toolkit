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

  const currentAttendance =
    conducted > 0 ? (attended / conducted) * 100 : 0;

  const usingPlannedMode = plannedClasses.trim() !== "";

  let resultMessage = "";
  let resultColor = "";

  const invalidInput =
    attended > conducted ||
    (usingPlannedMode && conducted > planned);

  if (!invalidInput) {
    if (usingPlannedMode) {
      // SEMESTER-CONSTRAINED MODE

      const remainingClasses = planned - conducted;

      const minimumAttendanceNeeded = Math.ceil(
        (required / 100) * planned
      );

      const futureClassesNeeded = Math.max(
        minimumAttendanceNeeded - attended,
        0
      );

      const maxClassesCanMiss =
        remainingClasses - futureClassesNeeded;

      if (maxClassesCanMiss >= 0) {
        resultMessage = `You can still miss ${maxClassesCanMiss} classes this semester.`;
        resultColor = "text-green-600";
      } else {
        resultMessage =
          "You can no longer reach the required attendance this semester.";
        resultColor = "text-red-600";
      }
    } else {
      // ROLLING MODE

      let classesCanMiss = 0;

      while (
        ((attended / (conducted + classesCanMiss)) * 100) >=
        required
      ) {
        classesCanMiss++;
      }

      classesCanMiss--;

      if (classesCanMiss >= 0) {
        resultMessage = `You can currently miss ${classesCanMiss} more classes before dropping below ${required}%.`;
        resultColor = "text-green-600";
      } else {
        let classesNeeded = 0;

        while (
          (((attended + classesNeeded) /
            (conducted + classesNeeded)) *
            100) <
          required
        ) {
          classesNeeded++;
        }

        resultMessage = `You need to attend ${classesNeeded} consecutive classes to reach ${required}%.`;

        resultColor = "text-red-600";
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Attendance Calculator
        </h1>

        <div className="flex flex-col gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Total Planned Classes (Optional)
            </label>

            <input
              type="number"
              placeholder="Leave empty if unknown"
              value={plannedClasses}
              onChange={(e) =>
                setPlannedClasses(e.target.value)
              }
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
              onChange={(e) =>
                setConductedClasses(e.target.value)
              }
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
              onChange={(e) =>
                setAttendedClasses(e.target.value)
              }
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
              onChange={(e) =>
                setRequiredAttendance(e.target.value)
              }
              className="border p-3 rounded-lg w-full"
            />
          </div>

        </div>

        {!invalidInput ? (
          <div className="mt-8 space-y-4">

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Current Attendance
              </p>

              <p className="text-2xl font-bold">
                {currentAttendance.toFixed(2)}%
              </p>
            </div>

            <div
              className={`bg-gray-100 p-4 rounded-xl font-medium ${resultColor}`}
            >
              {resultMessage}
            </div>

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