// src/App.jsx

import React, { useState } from "react";
import WhatsAppClone from "./Components/WhatsappClone";
import AccountSelection from "./Components/AccountSelection";

function App() {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div>
      {selectedAccount ? (
        <WhatsAppClone account={selectedAccount} />
      ) : (
        <AccountSelection onSelectAccount={handleSelectAccount} />
      )}
    </div>
  );
}

export default App;
