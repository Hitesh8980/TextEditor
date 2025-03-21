import { Node, mergeAttributes } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

const variableItems = [
  { id: "user_name", label: "User Name", value: "{{user_name}}" },
  { id: "company", label: "Company", value: "{{company}}" },
  { id: "email", label: "Email Address", value: "{{email}}" },
  { id: "date", label: "Current Date", value: "{{date}}" },
  { id: "subscription_plan", label: "Subscription Plan", value: "{{subscription_plan}}" },
  { id: "account_balance", label: "Account Balance", value: "{{account_balance}}" },
  { id: "support_phone", label: "Support Phone", value: "{{support_phone}}" },
  { id: "website_url", label: "Website URL", value: "{{website_url}}" },
];

export const VariableExtension = Node.create({
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
      mergeAttributes({
        "data-variable": node.attrs.value,
        style: "background-color: #1890ff; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer;",
      }),
      node.attrs.value || "",
    ];
  },

  toText({ node }) {
    return node.attrs.value || "";
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement("span");
      dom.setAttribute("data-variable", node.attrs.value || "");
      dom.style.backgroundColor = "#1890ff";
      dom.style.color = "white";
      dom.style.padding = "2px 6px";
      dom.style.borderRadius = "4px";
      dom.style.cursor = "pointer";
      dom.innerText = node.attrs.value || "";

      dom.addEventListener("click", () => {
        const { from } = editor.state.selection;
        editor.commands.setTextSelection({
          from: from - (node.attrs.value?.length || 0),
          to: from,
        });
        editor.commands.insertContent("{{");
      });

      return { dom };
    };
  },

  addOptions() {
    return {
      suggestion: {
        char: "{{",
        allowSpaces: false,
        startOfLine: false,
        items: ({ query }) => {
          console.log("Showing variable suggestions for query:", query);
          return variableItems.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
          );
        },
        command: ({ editor, range, props }) => {
          console.log("Inserting variable:", props.value, "Range:", range);
          editor
            .chain()
            .focus()
            .deleteRange(range) // Delete the typed "{{query"
            .insertContent({
              type: this.name, // "variable"
              attrs: { value: props.value },
            })
            .run();
        },
        render: () => {
          let component;
          let selectedIndex = 0;

          return {
            onStart: (props) => {
              console.log("Suggestion popup started:", props);
              if (props.items.length === 0) {
                console.log("No items to show, skipping popup");
                return;
              }
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
              console.log("Suggestion popup updated:", props);
              if (!component || props.items.length === 0) {
                if (component) {
                  component.remove();
                  component = null;
                }
                return;
              }
              selectedIndex = Math.max(0, Math.min(selectedIndex, props.items.length - 1));
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
              console.log("Suggestion popup exited");
              if (component) {
                component.remove();
                component = null;
              }
            },
          };

          function update(props) {
            if (!component) return;
            console.log("Updating suggestion popup with items:", props.items);
            component.innerHTML = "";
            props.items.forEach((item, index) => {
              const div = document.createElement("div");
              div.style.padding = "5px 8px";
              div.style.cursor = "pointer";
              div.style.borderRadius = "3px";
              div.style.transition = "background-color 0.2s";
              div.style.backgroundColor = index === selectedIndex ? "#e6f7ff" : "white";
              div.innerText = item.label;
              div.addEventListener("click", () => props.command(item));
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

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});