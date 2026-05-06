"use client";

import { useState } from "react";

type Subject = {
  id: number;
  name: string;
  planned: string;
  conducted: string;
  attended: string;
  required: string;
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: "",
      planned: "",
      conducted: "",
      attended: "",
      required: "75",
    },
  ]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: "",
        planned: "",
        conducted: "",
        attended: "",
        required: "75",
      },
    ]);
  };

  const updateSubject = (
    id: number,
    field: keyof Subject,
    value: string
  ) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, [field]: value }
          : subject
      )
    );
  };

  // OVERALL DASHBOARD CALCULATIONS

  const totalConducted = subjects.reduce(
    (sum, subject) =>
      sum + Number(subject.conducted || 0),
    0
  );

  const totalAttended = subjects.reduce(
    (sum, subject) =>
      sum + Number(subject.attended || 0),
    0
  );

  const overallAttendance =
    totalConducted > 0
      ? (totalAttended / totalConducted) * 100
      : 0;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Attendance Survival Dashboard
        </h1>

        {/* OVERALL DASHBOARD */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Overall Attendance Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Total Conducted
              </p>

              <p className="text-3xl font-bold">
                {totalConducted}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Total Attended
              </p>

              <p className="text-3xl font-bold">
                {totalAttended}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-medium">
                Overall Attendance
              </p>

              <p
                className={`text-3xl font-bold ${
                  overallAttendance >= 75
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {overallAttendance.toFixed(2)}%
              </p>
            </div>

          </div>

        </div>

        {/* SUBJECT CARDS */}

        <div className="flex flex-col gap-6">

          {subjects.map((subject) => {

            const planned = Number(subject.planned);
            const conducted = Number(subject.conducted);
            const attended = Number(subject.attended);
            const required = Number(subject.required);

            const usingPlannedMode =
              subject.planned.trim() !== "";

            const currentAttendance =
              conducted > 0
                ? (attended / conducted) * 100
                : 0;

            const invalidInput =
              attended > conducted ||
              (usingPlannedMode &&
                conducted > planned);

            let resultMessage = "";
            let resultColor = "";

            if (!invalidInput) {

              if (usingPlannedMode) {

                // PLANNED MODE

                const remainingClasses =
                  planned - conducted;

                const minimumAttendanceNeeded =
                  Math.ceil(
                    (required / 100) * planned
                  );

                const futureClassesNeeded =
                  Math.max(
                    minimumAttendanceNeeded -
                      attended,
                    0
                  );

                const maxClassesCanMiss =
                  remainingClasses -
                  futureClassesNeeded;

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
                  ((attended /
                    (conducted +
                      classesCanMiss)) *
                    100) >=
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
                    (((attended +
                      classesNeeded) /
                      (conducted +
                        classesNeeded)) *
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
              <div
                key={subject.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                <input
                  type="text"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubject(
                      subject.id,
                      "name",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-lg w-full mb-5 text-lg font-semibold"
                />

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="block mb-2 font-medium">
                      Planned Classes (Optional)
                    </label>

                    <input
                      type="number"
                      placeholder="Leave empty if unknown"
                      value={subject.planned}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "planned",
                          e.target.value
                        )
                      }
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Conducted Classes
                    </label>

                    <input
                      type="number"
                      value={subject.conducted}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "conducted",
                          e.target.value
                        )
                      }
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Attended Classes
                    </label>

                    <input
                      type="number"
                      value={subject.attended}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "attended",
                          e.target.value
                        )
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
                      value={subject.required}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "required",
                          e.target.value
                        )
                      }
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                </div>

                {!invalidInput ? (

                  <div className="mt-6 space-y-4">

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

                  <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-xl">
                    Please check your inputs.
                  </div>

                )}

              </div>
            );
          })}

        </div>

        <button
          onClick={addSubject}
          className="mt-8 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          + Add Subject
        </button>

      </div>
    </main>
  );
}