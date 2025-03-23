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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Incentives Page
        </h1>
        {output.map((line, index) => (
          <p key={index} className="text-lg text-gray-700 my-4">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default IncentivesPage;
