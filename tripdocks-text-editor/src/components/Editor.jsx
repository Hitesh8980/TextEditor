import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import jsPDF from "jspdf";
import TurndownService from "turndown";
import { VariableExtension, VariableNode } from "../extensions/variableExtensions";
import { renderVariables } from "../extensions/variable";
import Toolbar from "./Toolbar";

const Editor = () => {
  const [editorContent, setEditorContent] = useState(localStorage.getItem("editorContent") || "");

  const editor = useEditor({
    extensions: [StarterKit, VariableExtension, VariableNode],
    content: editorContent,
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setEditorContent(content);
      localStorage.setItem("editorContent", content);
    },
    onCreate: () => {
      console.log("Editor initialized");
    },
  });

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const clearContent = () => {
    if (!editor) return;
    editor.commands.clearContent(true);
    setEditorContent("");
    localStorage.removeItem("editorContent");
  };

  const exportToPDF = (format = "raw") => {
    if (!editor) return;
    const doc = new jsPDF();
    let content = editor.getText();
    if (format === "rendered") {
      content = renderVariables(content);
    }
    doc.text(content, 10, 10);
    doc.save(`editor-content-${format}.pdf`);
  };

  const exportToMarkdown = (format = "raw") => {
    if (!editor) return;
    const turndownService = new TurndownService();
    let content = editor.getHTML();
    if (format === "rendered") {
      const text = editor.getText();
      const renderedText = renderVariables(text);
      content = renderedText;
    }
    const markdown = turndownService.turndown(content);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `editor-content-${format}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        📝 Email Template Editor
      </h2>
      <Toolbar editor={editor} />
      <div
        style={{
          border: "1px solid #e0e0e0",
          padding: "15px",
          minHeight: "200px",
          borderRadius: "8px",
          outline: "none",
          fontSize: "16px",
          cursor: "text",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button
          onClick={clearContent}
          style={{
            background: "#ff4d4f",
            color: "white",
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🗑️ Clear
        </button>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => exportToPDF("raw")}
            style={{
              background: "#52c41a",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            📄 Export PDF (Raw)
          </button>
          <button
            onClick={() => exportToPDF("rendered")}
            style={{
              background: "#52c41a",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            📄 Export PDF (Rendered)
          </button>
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => exportToMarkdown("raw")}
            style={{
              background: "#1890ff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⬇️ Export MD (Raw)
          </button>
          <button
            onClick={() => exportToMarkdown("rendered")}
            style={{
              background: "#1890ff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⬇️ Export MD (Rendered)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;