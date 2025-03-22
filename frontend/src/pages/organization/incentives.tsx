import React, { useState, useEffect } from "react";

const IncentivesPage = () => {
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    const processData = async () => {
      const messages: string[] = [];
      messages.push(
        "Welcome to the Incentives Page: Your Carbon Footprint Analysis and Govt Incentives"
      );
      messages.push("Processing your data...");

      // Simulated database call for policy data
      const policyData = 100; // example threshold from policy data file
      // Simulated dashboard cumulative data (e.g., carbon footprint)
      const dashboardData = 50; // example cumulative data

      if (dashboardData < policyData) {
        messages.push(
          "Eligible Incentives: You qualify for a government subsidy for carbon emission reductions."
        );
      } else {
        messages.push("No additional incentive available at this moment.");
      }
      messages.push(
        `Your current carbon footprint is: ${dashboardData} units.`
      );
      messages.push(
        "Thank you for visiting the Incentives page. Please check back for updates."
      );

      setOutput(messages);
    };

    processData();
  }, []);

  return (
    <div>
      {output.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

export default IncentivesPage;
