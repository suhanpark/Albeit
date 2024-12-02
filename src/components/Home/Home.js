import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, orderBy } from "firebase/firestore";

const Home = () => {
  const db = getFirestore();
  const [status, setStatus] = useState("clocked-out");
  const [payRate, setPayRate] = useState(0);
  const [lastClockIn, setLastClockIn] = useState(null);
  const userId = "currentUserId"; // Replace with actual userId logic

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setPayRate(data.payRate || 0);
      }
    };
    fetchUserData();
  }, []);

  const handleClockIn = async () => {
    const shiftDoc = await addDoc(collection(db, "users", userId, "shifts"), {
      clockIn: new Date(),
    });
    setStatus("clocked-in");
    setLastClockIn(new Date());
  };

  const handleClockOut = async () => {
    const q = query(collection(db, "users", userId, "shifts"), orderBy("clockIn", "desc"));
    // Find the last shift and update clockOut.
    setStatus("clocked-out");
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Status: {status}</p>
      {status === "clocked-out" ? (
        <button onClick={handleClockIn}>Clock In</button>
      ) : (
        <button onClick={handleClockOut}>Clock Out</button>
      )}
    </div>
  );
};

export default Home;

const updatePayRate = async () => {
    const newRate = prompt("Enter new pay rate:", payRate);
    if (newRate) {
      await setDoc(doc(db, "users", userId), { payRate: parseFloat(newRate) }, { merge: true });
      setPayRate(parseFloat(newRate));
    }
  };
  
  // Add to the Home.js return JSX:
  <p onClick={updatePayRate}>Pay Rate: ${payRate}/hr</p>
  