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

export const MENTION_VALUES = {
  "@JohnDoe": "John Doe",
  "@JaneSmith": "Jane Smith",
  "@BobJones": "Bob Jones",
  "@AliceBrown": "Alice Brown",
};

export const renderVariables = (text) => {
  const inputText = typeof text === "string" ? text : "";
  if (!inputText) {
    console.warn("renderVariables received invalid input:", text);
    return "";
  }

  let renderedText = inputText.trim();
  console.log("Input to renderVariables:", renderedText);

  // Replace variables
  Object.keys(VARIABLE_VALUES).forEach((variable) => {
    const value = VARIABLE_VALUES[variable];
    const regex = new RegExp(variable.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    renderedText = renderedText.replace(regex, value);
    console.log(`After replacing ${variable}:`, renderedText);
  });

  // Replace mentions
  Object.keys(MENTION_VALUES).forEach((mention) => {
    const value = MENTION_VALUES[mention];
    const regex = new RegExp(mention.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    renderedText = renderedText.replace(regex, value);
    console.log(`After replacing ${mention}:`, renderedText);
  });

  console.log("Output from renderVariables:", renderedText);
  return renderedText;
};