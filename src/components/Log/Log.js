import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const Log = () => {
  const db = getFirestore();
  const userId = "currentUserId"; // Replace with actual userId logic
  const [shifts, setShifts] = useState([]);
  const [payRate, setPayRate] = useState(0);

  useEffect(() => {
    const fetchShifts = async () => {
      const shiftsRef = collection(db, "users", userId, "shifts");
      const q = query(shiftsRef, where("clockOut", "!=", null));
      const querySnapshot = await getDocs(q);
      const fetchedShifts = [];
      querySnapshot.forEach((doc) => {
        fetchedShifts.push({ id: doc.id, ...doc.data() });
      });
      setShifts(fetchedShifts);
    };
    const fetchPayRate = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setPayRate(userDoc.data().payRate || 0);
      }
    };
    fetchShifts();
    fetchPayRate();
  }, []);

  const handlePaid = async (date) => {
    const shiftsToRemove = shifts.filter((shift) => shift.clockIn.toDate() <= date);
    for (const shift of shiftsToRemove) {
      await deleteDoc(doc(db, "users", userId, "shifts", shift.id));
    }
    setShifts((prev) => prev.filter((shift) => shift.clockIn.toDate() > date));
  };

  return (
    <div>
      <h1>Log</h1>
      <button onClick={() => { /* Add logic for "Paid" dropdown */ }}>Paid</button>
      <ul>
        {shifts.map((shift) => {
          const clockInTime = shift.clockIn.toDate();
          const clockOutTime = shift.clockOut?.toDate();
          const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60);
          return (
            <li key={shift.id}>
              {clockInTime.toDateString()}: {hoursWorked.toFixed(2)} hours - ${(hoursWorked * payRate).toFixed(2)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Log;
