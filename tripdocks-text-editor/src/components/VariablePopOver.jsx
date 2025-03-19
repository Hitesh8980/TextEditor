import React from "react";

const VARIABLES = [
  { id: "user_name", label: "User Name", value: "{{user_name}}" },
  { id: "company", label: "Company", value: "{{company}}" },
  { id: "email", label: "Email Address", value: "{{email}}" },
  { id: "date", label: "Current Date", value: "{{date}}" },
  { id: "subscription_plan", label: "Subscription Plan", value: "{{subscription_plan}}" },
  { id: "account_balance", label: "Account Balance", value: "{{account_balance}}" },
  { id: "support_phone", label: "Support Phone", value: "{{support_phone}}" },
  { id: "website_url", label: "Website URL", value: "{{website_url}}" },
];

const VariablePopover = ({ onSelect }) => {
  return (
    <div className="popover">
      {VARIABLES.map((variable) => (
        <div
          key={variable.id}
          className="popover-item"
          onClick={() => onSelect(variable.value)}
        >
          {variable.label}
        </div>
      ))}
    </div>
  );
};

export default VariablePopover;