import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import jsPDF from "jspdf";
import TurndownService from "turndown";
import { VariableExtension, VariableNode, MentionNode } from "../extensions/variableExtensions";
import { renderVariables } from "../extensions/variable"; 
import Toolbar from "./Toolbar";

const Editor = () => {
  const [editorContent, setEditorContent] = useState(localStorage.getItem("editorContent") || "");

  const editor = useEditor({
    extensions: [StarterKit, VariableExtension, VariableNode, MentionNode],
    content: editorContent,
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      console.log("Editor updated - HTML content:", content);
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

  const getEditorText = (editor) => {
    if (!editor) {
      console.warn("getEditorText: Editor is not initialized");
      return "";
    }
    const doc = editor.getJSON();
    if (!doc || !doc.content) {
      console.warn("getEditorText: Editor JSON content is empty or invalid", doc);
      return "";
    }

    let text = "";

    const traverseNode = (node) => {
      if (!node) return;
      if (node.type === "text" && node.text) {
        text += node.text;
      } else if (node.type === "variable" && node.attrs && node.attrs.value) {
        text += node.attrs.value;
      } else if (node.type === "mention" && node.attrs && node.attrs.value) {
        text += node.attrs.value;
      }
      if (node.content) {
        node.content.forEach(traverseNode);
      }
    };

    doc.content.forEach(traverseNode);
    console.log("getEditorText result:", text);
    return text || "";
  };

  const clearContent = () => {
    if (!editor) return;
    editor.commands.clearContent(true);
    setEditorContent("");
    localStorage.removeItem("editorContent");
  };

  const exportToPDF = (format = "raw") => {
    if (!editor) {
      console.error("Editor is not initialized");
      return;
    }
    const doc = new jsPDF();
    console.log("Editor JSON content:", editor.getJSON());
    let content = getEditorText(editor);
    console.log("Raw content from getEditorText():", content);
    if (format === "rendered") {
      content = renderVariables(content);
      console.log("Rendered content after renderVariables:", content);
    }
    doc.text(content, 10, 10);
    doc.save(`editor-content-${format}.pdf`);
  };

  const exportToMarkdown = (format = "raw") => {
    if (!editor) {
      console.error("Editor is not initialized");
      return;
    }
    const turndownService = new TurndownService();
    let content;
    if (format === "rendered") {
      const text = getEditorText(editor);
      console.log("Text for Markdown (rendered):", text);
      const renderedText = renderVariables(text);
      console.log("Rendered text for Markdown:", renderedText);
      content = `<p>${renderedText}</p>`;
    } else {
      content = editor.getHTML();
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
    return (
      <div className="text-center text-gray-500 py-10">
        <svg
          className="animate-spin h-5 w-5 text-gray-500 inline-block mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading editor...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          Email Template Editor
        </h2>
        <div className="text-sm text-gray-500">
          Last saved: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4">
        <Toolbar editor={editor} />
      </div>

      {/* Editor Area */}
      <div
        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[300px] text-gray-800 text-base leading-relaxed focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={clearContent}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none transition-all duration-200 shadow-sm"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          Clear
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => exportToPDF("raw")}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-200 shadow-sm"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            PDF (Raw)
          </button>
          <button
            onClick={() => exportToPDF("rendered")}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-200 shadow-sm"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            PDF (Rendered)
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToMarkdown("raw")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 shadow-sm"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            MD (Raw)
          </button>
          <button
            onClick={() => exportToMarkdown("rendered")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 shadow-sm"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            MD (Rendered)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;