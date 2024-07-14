import React from "react";

function AccountSelection({ onSelectAccount }) {
  const handleSelect = (account) => {
    onSelectAccount(account);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Select your account:</h1>
      <button
        onClick={() =>
          handleSelect({
            displayName: "Rajat Agent",
            CompanyId: 386.0,
            userId: 45518.0,
            emailAddress: "rajat.sharma@riskhawk.net",
          })
        }
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "rgb(80,80,200)",
          color: "white",
        }}
      >
        Rajat Agent
      </button>
      <button
        onClick={() =>
          handleSelect({
            displayName: "Shriram Agent",
            CompanyId: 386.0,
            userId: 45522.0,
            emailAddress: "shriram@riskhawk.net",
          })
        }
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "rgb(80,80,200)",
          color: "white",
        }}
      >
        Shriram Agent
      </button>
    </div>
  );
}

export default AccountSelection;
