import { Node, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

const suggestionItems = [
  { id: "user_name", label: "User Name", value: "{{user_name}}" },
  { id: "company", label: "Company", value: "{{company}}" },
  { id: "email", label: "Email Address", value: "{{email}}" },
  { id: "date", label: "Current Date", value: "{{date}}" },
  { id: "subscription_plan", label: "Subscription Plan", value: "{{subscription_plan}}" },
  { id: "account_balance", label: "Account Balance", value: "{{account_balance}}" },
  { id: "support_phone", label: "Support Phone", value: "{{support_phone}}" },
  { id: "website_url", label: "Website URL", value: "{{website_url}}" },
];

const mentionItems = [
  { id: "john_doe", label: "John Doe", value: "@JohnDoe" },
  { id: "jane_smith", label: "Jane Smith", value: "@JaneSmith" },
  { id: "bob_jones", label: "Bob Jones", value: "@BobJones" },
  { id: "alice_brown", label: "Alice Brown", value: "@AliceBrown" },
];

export const VariableNode = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      value: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
        getAttrs: (dom) => ({
          value: dom.getAttribute("data-variable"),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-variable": node.attrs.value,
        style:
          "background-color: #1890ff; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer; position: relative;",
      },
      node.attrs.value,
    ];
  },

  toText({ node }) {
    console.log("VariableNode toText - node.attrs.value:", node.attrs.value);
    return node.attrs.value || "";
  },

  addNodeView() {
    return ({ node, editor }) => {
      const wrapper = document.createElement("span");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      const dom = document.createElement("span");
      dom.setAttribute("data-variable", node.attrs.value || "");
      dom.style.backgroundColor = "#1890ff";
      dom.style.color = "white";
      dom.style.padding = "2px 6px";
      dom.style.borderRadius = "4px";
      dom.style.cursor = "pointer";
      dom.innerText = node.attrs.value || "";

      const changeButton = document.createElement("button");
      changeButton.innerText = "Change variable";
      changeButton.style.position = "absolute";
      changeButton.style.top = "100%";
      changeButton.style.left = "0";
      changeButton.style.backgroundColor = "white";
      changeButton.style.border = "1px solid #ccc";
      changeButton.style.borderRadius = "4px";
      changeButton.style.padding = "2px 6px";
      changeButton.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.1)";
      changeButton.style.display = "none";
      changeButton.style.zIndex = "999";

      wrapper.appendChild(dom);
      wrapper.appendChild(changeButton);

      dom.addEventListener("click", () => {
        const { from } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - (node.attrs.value?.length || 0), to: from });
        editor.commands.insertContent("{{");
      });

      dom.addEventListener("mouseenter", () => {
        changeButton.style.display = "block";
      });

      dom.addEventListener("mouseleave", () => {
        changeButton.style.display = "none";
      });

      changeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const { from } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - (node.attrs.value?.length || 0), to: from });
        editor.commands.insertContent("{{");
      });

      return {
        dom: wrapper,
      };
    };
  },
});

export const MentionNode = Node.create({
  name: "mention",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      value: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-mention]",
        getAttrs: (dom) => ({
          value: dom.getAttribute("data-mention"),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-mention": node.attrs.value,
        style:
          "background-color: #f0f0f0; color: #333; padding: 2px 6px; border-radius: 4px; cursor: pointer; position: relative;",
      },
      node.attrs.value,
    ];
  },

  toText({ node }) {
    console.log("MentionNode toText - node.attrs.value:", node.attrs.value);
    return node.attrs.value || "";
  },

  addNodeView() {
    return ({ node, editor }) => {
      const wrapper = document.createElement("span");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      const dom = document.createElement("span");
      dom.setAttribute("data-mention", node.attrs.value || "");
      dom.style.backgroundColor = "#f0f0f0";
      dom.style.color = "#333";
      dom.style.padding = "2px 6px";
      dom.style.borderRadius = "4px";
      dom.style.cursor = "pointer";
      dom.innerText = node.attrs.value || "";

      wrapper.appendChild(dom);

      dom.addEventListener("click", () => {
        const { from } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - (node.attrs.value?.length || 0), to: from });
        editor.commands.insertContent("@");
      });

      return {
        dom: wrapper,
      };
    };
  },
});

export const VariableExtension = Extension.create({
  name: "variableExtension",

  addOptions() {
    return {
      suggestion: {
        // Use a single char to initialize the plugin; we'll handle multiple triggers manually
        char: "@",
        allowSpaces: false,
        startOfLine: false,
        // Custom decorationNode to prevent conflicts
        decorationNode: null,
        // Custom suggestion logic to detect the trigger
        items: ({ editor, query, range }) => {
          // Get the text before the cursor to determine the trigger
          const { from } = editor.state.selection;
          const textBefore = editor.state.doc.textBetween(Math.max(0, from - 10), from, "\0");
          console.log("Text before cursor:", textBefore);

          let triggerChar = null;
          let adjustedQuery = query;

          // Check for {{ trigger
          if (textBefore.endsWith("{{")) {
            triggerChar = "{{";
            adjustedQuery = query;
          }
          // Check for @ trigger
          else if (textBefore.endsWith("@")) {
            triggerChar = "@";
            adjustedQuery = query;
          }

          console.log("Detected triggerChar:", triggerChar, "Query:", adjustedQuery);

          if (triggerChar === "{{") {
            const filteredItems = suggestionItems.filter((item) =>
              item.label.toLowerCase().includes(adjustedQuery.toLowerCase())
            );
            console.log("Filtered suggestion items for variables:", filteredItems);
            return filteredItems;
          } else if (triggerChar === "@") {
            const filteredItems = mentionItems.filter((item) =>
              item.label.toLowerCase().includes(adjustedQuery.toLowerCase())
            );
            console.log("Filtered suggestion items for mentions:", filteredItems);
            return filteredItems;
          }

          return [];
        },
        command: ({ editor, range, props }) => {
          const { from, to } = range;
          const textBefore = editor.state.doc.textBetween(Math.max(0, from - 2), from, "\0");
          const triggerChar = textBefore.includes("{{") ? "{{" : "@";
          console.log("Trigger char in command:", triggerChar, "Inserting value:", props.value);

          if (triggerChar === "{{") {
            editor
              .chain()
              .focus()
              .deleteRange({ from: from - 2, to })
              .insertContent({
                type: "variable",
                attrs: { value: props.value },
              })
              .run();
          } else if (triggerChar === "@") {
            editor
              .chain()
              .focus()
              .deleteRange({ from: from - 1, to })
              .insertContent({
                type: "mention",
                attrs: { value: props.value },
              })
              .run();
          }
          editor.commands.focus();
        },
        render: () => {
          let component;
          let selectedIndex = 0;

          return {
            onStart: (props) => {
              component = document.createElement("div");
              component.style.position = "absolute";
              component.style.background = "white";
              component.style.border = "1px solid #d9d9d9";
              component.style.padding = "5px";
              component.style.borderRadius = "4px";
              component.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.1)";
              component.style.zIndex = "999";
              component.style.minWidth = "150px";

              if (props.clientRect) {
                component.style.top = `${props.clientRect.top + window.scrollY + 20}px`;
                component.style.left = `${props.clientRect.left + window.scrollX}px`;
              }

              document.body.appendChild(component);
              update(props);
            },
            onUpdate: (props) => {
              selectedIndex = 0;
              update(props);
            },
            onKeyDown: (props) => {
              if (props.event.key === "ArrowDown") {
                selectedIndex = (selectedIndex + 1) % props.items.length;
                update(props);
                return true;
              }
              if (props.event.key === "ArrowUp") {
                selectedIndex = (selectedIndex - 1 + props.items.length) % props.items.length;
                update(props);
                return true;
              }
              if (props.event.key === "Enter") {
                props.command(props.items[selectedIndex]);
                return true;
              }
              if (props.event.key === "Escape") {
                if (component) {
                  component.remove();
                  component = null;
                }
                return true;
              }
              return false;
            },
            onExit: () => {
              if (component) {
                component.remove();
                component = null;
              }
            },
          };

          function update(props) {
            if (!component) return;
            component.innerHTML = "";
            props.items.forEach((item, index) => {
              const div = document.createElement("div");
              div.style.padding = "5px 8px";
              div.style.cursor = "pointer";
              div.style.borderRadius = "3px";
              div.style.transition = "background-color 0.2s";
              div.style.backgroundColor = index === selectedIndex ? "#e6f7ff" : "white";
              div.innerText = item.label;
              div.addEventListener("click", () => {
                props.command(item);
              });
              div.addEventListener("mouseenter", () => {
                selectedIndex = index;
                div.style.backgroundColor = "#f0f0f0";
              });
              div.addEventListener("mouseleave", () => {
                div.style.backgroundColor = index === selectedIndex ? "#e6f7ff" : "white";
              });
              component.appendChild(div);
            });
          }
        },
      },
    };
  },

  addCommands() {
    return {
      insertVariable:
        (variable) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: "variable",
              attrs: { value: variable.value },
            })
            .run();
        },
      insertMention:
        (mention) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: "mention",
              attrs: { value: mention.value },
            })
            .run();
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});