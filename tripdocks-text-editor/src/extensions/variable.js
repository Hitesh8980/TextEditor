export const VARIABLE_VALUES = {
    "{{user_name}}": "John Doe",
    "{{company}}": "TripDocks Inc.",
    "{{email}}": "john.doe@tripdocks.com",
    "{{date}}": new Date().toLocaleDateString(),
    "{{subscription_plan}}": "Premium Plan",
    "{{account_balance}}": "$1,234.56",
    "{{support_phone}}": "+1-800-555-1234",
    "{{website_url}}": "https://www.tripdocks.com",
  };
  
  export const renderVariables = (text) => {
    let renderedText = text;
    Object.keys(VARIABLE_VALUES).forEach((variable) => {
      const value = VARIABLE_VALUES[variable];
      renderedText = renderedText.replaceAll(variable, value);
    });
    return renderedText;
  };