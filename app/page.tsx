"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: number;
  name: string;
  planned: string;
  conducted: string;
  attended: string;
  required: string;
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // LOAD FROM LOCAL STORAGE

  useEffect(() => {
    const savedSubjects = localStorage.getItem(
      "attendance-subjects"
    );

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects([
        {
          id: Date.now(),
          name: "",
          planned: "",
          conducted: "",
          attended: "",
          required: "75",
        },
      ]);
    }
  }, []);

  // SAVE TO LOCAL STORAGE

  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem(
        "attendance-subjects",
        JSON.stringify(subjects)
      );
    }
  }, [subjects]);

  // ADD SUBJECT

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

  // DELETE SUBJECT

  const deleteSubject = (id: number) => {
    setSubjects(
      subjects.filter((subject) => subject.id !== id)
    );
  };

  // UPDATE SUBJECT

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

  // OVERALL DASHBOARD ANALYTICS

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
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Attendance Survival Dashboard
          </h1>

          <p className="text-gray-600">
            Plan your attendance. Track risks.
            Survive the semester.
          </p>
        </div>

        {/* OVERALL ANALYTICS */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Overall Attendance Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-gray-100 p-5 rounded-xl">
              <p className="text-gray-600 mb-2">
                Total Conducted
              </p>

              <p className="text-3xl font-bold">
                {totalConducted}
              </p>
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              <p className="text-gray-600 mb-2">
                Total Attended
              </p>

              <p className="text-3xl font-bold">
                {totalAttended}
              </p>
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              <p className="text-gray-600 mb-2">
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
              conducted < 0 ||
              attended < 0 ||
              required <= 0 ||
              required > 100 ||
              (usingPlannedMode &&
                (conducted > planned ||
                  planned <= 0));

            let resultMessage = "";
            let resultColor = "";
            let dangerLevel = "";

            if (!invalidInput) {

              if (usingPlannedMode) {

                // SEMESTER-CONSTRAINED MODE

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

              // DANGER LEVEL

              if (currentAttendance >= required + 10) {
                dangerLevel = "Safe";
              } else if (
                currentAttendance >= required + 5
              ) {
                dangerLevel = "Moderate";
              } else {
                dangerLevel = "Risky";
              }
            }

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                {/* TOP BAR */}

                <div className="flex justify-between items-center mb-5">

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
                    className="border p-3 rounded-lg w-[80%] text-lg font-semibold"
                  />

                  <button
                    onClick={() =>
                      deleteSubject(subject.id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

                {/* INPUT GRID */}

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

                {/* RESULTS */}

                {!invalidInput ? (

                  <div className="mt-6 grid md:grid-cols-3 gap-4">

                    <div className="bg-gray-100 p-4 rounded-xl">
                      <p className="text-gray-600 mb-2">
                        Current Attendance
                      </p>

                      <p className="text-2xl font-bold">
                        {currentAttendance.toFixed(2)}%
                      </p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl">
                      <p className="text-gray-600 mb-2">
                        Status
                      </p>

                      <p
                        className={`text-2xl font-bold ${
                          dangerLevel === "Safe"
                            ? "text-green-600"
                            : dangerLevel === "Moderate"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {dangerLevel}
                      </p>
                    </div>

                    <div
                      className={`bg-gray-100 p-4 rounded-xl ${resultColor}`}
                    >
                      <p className="font-medium">
                        Analysis
                      </p>

                      <p className="mt-2">
                        {resultMessage}
                      </p>
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

        {/* ADD SUBJECT BUTTON */}

        <div className="mt-8 text-center">

          <button
            onClick={addSubject}
            className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800"
          >
            + Add Subject
          </button>

        </div>

      </div>
    </main>
  );
}